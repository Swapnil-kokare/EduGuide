import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ArrowRight, Trophy, MapPin, GraduationCap, Star,
  TrendingUp, Search, RefreshCw, Sparkles, User, BookOpen, Settings2,
  CheckCircle2, School, Download, Loader2, AlertCircle
} from "lucide-react";
import { exportResultsPdf } from "@/lib/exportPdf";
import { motion, AnimatePresence } from "framer-motion";
import {
  predictColleges as apiPredictColleges,
  fetchCategories,
  fetchBranches,
  fetchCities,
} from "@/lib/apiService";
import {
  branches as fallbackBranches,
  locations as fallbackLocations,
  collegeTypes,
  categories as fallbackCategories,
  examTypes,
} from "@/lib/prediction";
import type { CategoryOption } from "@/lib/prediction";

const STEPS = [
  { label: "Personal Info", icon: User, desc: "Your basic details" },
  { label: "Your Score", icon: BookOpen, desc: "Exam performance" },
  { label: "Preferences", icon: Settings2, desc: "Branch & location" },
];
const MAX_PREDICTION_RESULTS = 20;

/* ─── Inline error component ─── */
const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-xs text-destructive mt-1.5 font-medium"
    >
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </motion.p>
  );
};

const Predict = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [examType, setExamType] = useState<"MHT-CET" | "JEE">("MHT-CET");
  const [score, setScore] = useState("");
  const [percentile, setPercentile] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [collegeType, setCollegeType] = useState("Any");

  // Dynamic data from backend
  const [dynamicCategories, setDynamicCategories] = useState<CategoryOption[]>([]);
  const [dynamicBranches, setDynamicBranches] = useState<string[]>([]);
  const [dynamicCities, setDynamicCities] = useState<string[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  // Field-level validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch dynamic data on mount
  useEffect(() => {
    const loadMeta = async () => {
      setMetaLoading(true);
      try {
        const [cats, brs, cts] = await Promise.all([
          fetchCategories(),
          fetchBranches(),
          fetchCities(),
        ]);
        if (cats.length > 0) setDynamicCategories(cats as CategoryOption[]);
        if (brs.length > 0) setDynamicBranches(brs);
        if (cts.length > 0) setDynamicCities(cts);
      } catch (e) {
        console.error("Failed to load meta data, using fallbacks");
      } finally {
        setMetaLoading(false);
      }
    };
    loadMeta();
  }, []);

  // Resolved lists (dynamic with fallback + deduplication)
  const categoriesList = dynamicCategories.length > 0 ? dynamicCategories : fallbackCategories;
  const branchesList = Array.from(new Set(
    (dynamicBranches.length > 0 ? dynamicBranches : fallbackBranches)
      .filter((b): b is string => typeof b === "string" && b.trim().length > 0)
  ));
  const citiesList = Array.from(new Set(
    (dynamicCities.length > 0 ? dynamicCities : fallbackLocations.filter(l => l !== "Any"))
      .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
  )).sort((a, b) => a.localeCompare(b));

  const selectedCategoryOption = categoriesList.find((item) => item.apiValue === category) ?? null;

  // ─── Validation ───
  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validateScore = useCallback((val: string) => {
    if (!val) return undefined;
    const num = Number(val);
    const max = examType === "MHT-CET" ? 200 : 300;
    if (isNaN(num) || num < 0 || num > max) {
      return `Score must be between 0 and ${max}`;
    }
    return undefined;
  }, [examType]);

  const validatePercentile = useCallback((val: string) => {
    if (!val) return "Percentile is required";
    const num = Number(val);
    if (isNaN(num) || num < 0 || num > 100) {
      return "Percentile must be between 0 and 100";
    }
    return undefined;
  }, []);

  const handleScoreChange = (val: string) => {
    setScore(val);
    const err = validateScore(val);
    if (err) setErrors((p) => ({ ...p, score: err }));
    else clearFieldError("score");
  };

  const handlePercentileChange = (val: string) => {
    setPercentile(val);
    const err = validatePercentile(val);
    if (err) setErrors((p) => ({ ...p, percentile: err }));
    else clearFieldError("percentile");
  };

  const canNext = () => {
    if (step === 0) return name.trim().length > 0 && category.length > 0 && gender.length > 0;
    if (step === 1) {
      const scoreErr = validateScore(score);
      const pctErr = validatePercentile(percentile);
      return !scoreErr && !pctErr && percentile.length > 0;
    }
    if (step === 2) return selectedBranches.length > 0;
    return false;
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!name.trim()) newErrors.name = "Name is required";
      if (!gender) newErrors.gender = "Please select your gender";
      if (!category) newErrors.category = "Please select a category";
    }

    if (step === 1) {
      const scoreErr = validateScore(score);
      if (scoreErr) newErrors.score = scoreErr;
      const pctErr = validatePercentile(percentile);
      if (pctErr) newErrors.percentile = pctErr;
    }

    if (step === 2) {
      if (selectedBranches.length === 0) newErrors.branches = "Select at least one branch";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  // ─── Submit ───
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    setError(null);

    const finalScore = Number(percentile);

    if (Number.isNaN(finalScore) || finalScore < 0 || finalScore > 100) {
      setError("Please enter a valid percentile between 0 and 100");
      setLoading(false);
      return;
    }

    try {
      if (!selectedCategoryOption) {
        throw new Error("Please select a valid CET category");
      }

      const response = await apiPredictColleges({
        percentile: finalScore,
        category: selectedCategoryOption.apiValue,
        branches: selectedBranches,
        cities: selectedCities,
        collegeTypes: collegeType === "Any" ? [] : [collegeType],
        examType,
        gender,
      });

      if (!response.success) {
        throw new Error("Failed to predict colleges from server");
      }

      const finalResults = (response.data || []).map((college: any, index: number) => {
        const mp = college.matchPercent ?? 100;
        // Determine match band from actual percentage
        let band = "Safe";
        if (mp >= 95) band = "Excellent";
        else if (mp >= 85) band = "Strong";
        else band = "Good";

        return {
          id: college._id || String(index),
          name: college.collegeName,
          location: college.city,
          branch: college.branch,
          cutoff: college.cutoff,
          type: college.collegeType || "Private",
          rating: college.rating || null,
          matchPercent: mp,
          matchBand: band,
          fees: college.fees || null,
        };
      });

      const uniqueResults = finalResults.slice(0, MAX_PREDICTION_RESULTS);

      // Show success screen briefly
      setLoading(false);
      setSuccess(true);
      setResults(uniqueResults);

      // Auto-transition to results after 2 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch predictions");
      setResults(null);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(0);
    setResults(null);
    setError(null);
    setSuccess(false);
    setName("");
    setGender("");
    setCategory("");
    setExamType("MHT-CET");
    setScore("");
    setPercentile("");
    setSelectedBranches([]);
    setSelectedCities([]);
    setCollegeType("Any");
    setErrors({});
  };

  const toggleBranch = (branch: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]
    );
    clearFieldError("branches");
  };

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="container py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl gradient-bg flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
            <Loader2 className="h-9 w-9 text-primary-foreground animate-spin" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Analyzing Your Profile...</h2>
          <p className="text-muted-foreground mb-2">Matching your {examType} {percentile} percentile against available colleges...</p>
          <p className="text-xs text-muted-foreground mb-8">Showing colleges with cutoffs at or below your percentile, sorted by the highest eligible cutoff</p>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Success animation screen ───
  if (success) {
    return (
      <div className="container py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-md mx-auto text-center"
        >
          <Card className="glass border-success/30 py-16">
            <CardContent className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </motion.div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-display text-2xl font-bold text-foreground"
              >
                Analysis Completed Successfully
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-muted-foreground"
              >
                We found the best colleges for your profile
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-2 text-xs text-muted-foreground mt-2"
              >
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading your results...
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ─── Results ───
  if (results || error) {
    if (error) {
      return (
        <div className="container py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="text-center py-20 glass border-destructive/50">
              <CardContent>
                <Search className="h-14 w-14 text-destructive mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Oops! Something went wrong</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {error}
                </p>
                <Button onClick={resetForm} className="gap-2 rounded-xl">
                  <RefreshCw className="h-4 w-4" /> Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    if (!results || results.length === 0) {
      return (
        <div className="container py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="text-center py-20 glass">
              <CardContent>
                <Search className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">No Matches Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find colleges matching your criteria. Try adjusting your preferences, selecting more branches, or changing the location filter.
                </p>
                <Button onClick={resetForm} className="gap-2 rounded-xl">
                  <RefreshCw className="h-4 w-4" /> Modify Preferences
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    const topMatch = results[0];
    const goodMatches = results.filter(r => r.matchPercent >= 75).length;
    return (
      <div className="container py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Your Results</h1>
              <p className="text-muted-foreground mt-1">
                Hi {name}, here are the <span className="text-foreground font-semibold">top {results.length} colleges</span> matching your {examType} profile ({percentile} percentile, {selectedCategoryOption?.label ?? category} category).
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => exportResultsPdf({ name, examType, percentile, category, results })}
                className="gap-2 rounded-xl"
              >
                <Download className="h-4 w-4" /> Export PDF
              </Button>
              <Button variant="outline" onClick={resetForm} className="gap-2 rounded-xl">
                <RefreshCw className="h-4 w-4" /> Start Over
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Matches", value: results.length, icon: School },
              { label: "Good Matches (75%+)", value: goodMatches, icon: CheckCircle2 },
              { label: `${examType} Percentile`, value: `${percentile}%`, icon: TrendingUp },
              { label: "Category", value: selectedCategoryOption?.label ?? category, icon: User },
            ].map((s) => (
              <Card key={s.label} className="glass">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top match */}
          {topMatch && (
            <Card className="mb-8 border-primary/20 glass overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-warning" />
                  <span className="text-sm font-semibold text-warning">🏆 Top Recommendation</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {topMatch.name}
                </h2>
                <p className="text-muted-foreground mb-4">{topMatch.branch}</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1"><MapPin className="h-3 w-3" />{topMatch.location}</Badge>
                  <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1"><GraduationCap className="h-3 w-3" />{topMatch.type}</Badge>
                  {topMatch.rating ? <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1"><Star className="h-3 w-3" />{topMatch.rating}/5</Badge> : null}
                  <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1">Cutoff: {topMatch.cutoff}%ile</Badge>
                  {topMatch.matchBand ? <Badge variant="secondary" className="rounded-lg px-3 py-1">{topMatch.matchBand}</Badge> : null}
                  <Badge className="gap-1 bg-success text-success-foreground rounded-lg px-3 py-1"><TrendingUp className="h-3 w-3" />{topMatch.matchPercent}% Match</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results grid */}
          {results.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.slice(1).map((college, i) => (
                <motion.div
                  key={college.id + college.branch}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass card-hover group">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{college.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{college.branch}</p>
                        </div>
                        <Badge
                          variant={college.matchPercent >= 75 ? "default" : "secondary"}
                          className={`rounded-lg ${college.matchPercent >= 75 ? "bg-success text-success-foreground" : ""}`}
                        >
                          {college.matchPercent}%
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{college.location}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><GraduationCap className="h-3 w-3" />{college.type}</span>
                        {college.rating ? <span className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3" />{college.rating}/5</span> : null}
                        <span className="text-xs text-muted-foreground">Cutoff: {college.cutoff}%ile</span>
                        {college.matchBand ? <span className="text-xs text-muted-foreground">{college.matchBand}</span> : null}
                      </div>
                      <Progress value={college.matchPercent} className="mt-3 h-1.5" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    );
  }

  // ─── Form wizard ───
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-3 w-3" /> College Predictor
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Find Your Perfect College
            </h1>
            <p className="text-muted-foreground mt-2">
              Fill in your details to get personalized recommendations.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex-1">
                <div className={`h-2 rounded-full transition-all duration-300 ${i < step ? "bg-success" : i === step ? "gradient-bg" : "bg-muted"
                  }`} />
                <div className="flex items-center gap-1.5 mt-2">
                  <s.icon className={`h-3.5 w-3.5 ${i <= step ? "text-primary" : "text-muted-foreground"}`} />
                  <p className={`text-xs ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                {(() => { const Icon = STEPS[step].icon; return <Icon className="h-5 w-5 text-primary" />; })()}
                {STEPS[step].label}
              </CardTitle>
              <CardDescription>
                {step === 0 && "Let's start with your basic information."}
                {step === 1 && "Enter your exam score and percentile accurately for best results."}
                {step === 2 && "Select your preferences — you can choose multiple branches and cities."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* ─── STEP 0: Personal Info ─── */}
                  {step === 0 && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g. Aarav Patil"
                          value={name}
                          onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                          className={`rounded-xl h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        />
                        <FieldError message={errors.name} />
                      </div>

                      <div className="space-y-1.5">
                        <Label>Gender</Label>
                        <Select
                          value={gender}
                          onValueChange={(val) => { setGender(val); clearFieldError("gender"); }}
                        >
                          <SelectTrigger className={`rounded-xl h-11 ${errors.gender ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError message={errors.gender} />
                      </div>

                      <div className="space-y-1.5">
                        <Label>Category (Caste)</Label>
                        {metaLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="h-11 w-full rounded-xl" />
                          </div>
                        ) : (
                          <Select
                            value={category}
                            onValueChange={(val) => { setCategory(val); clearFieldError("category"); }}
                          >
                            <SelectTrigger className={`rounded-xl h-11 ${errors.category ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                              <SelectValue placeholder="Select your category" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px] overflow-y-auto">
                              {categoriesList.map((c) => (
                                <SelectItem key={c.apiValue} value={c.apiValue}>{c.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <FieldError message={errors.category} />
                        <p className="text-xs text-muted-foreground">Reservation categories follow the CET Cell category set used for CAP cutoffs.</p>
                      </div>
                    </>
                  )}

                  {/* ─── STEP 1: Score ─── */}
                  {step === 1 && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Exam Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {examTypes.map((et) => (
                            <button
                              key={et}
                              type="button"
                              onClick={() => { setExamType(et); setScore(""); clearFieldError("score"); }}
                              className={`p-3 rounded-xl border text-sm font-medium transition-all ${examType === et
                                ? "border-primary/40 bg-primary/5 text-primary"
                                : "border-border hover:bg-muted/50 text-muted-foreground"
                                }`}
                            >
                              {et}
                            </button>
                          ))}
                        </div>
                        {examType === "JEE" && (
                          <p className="text-xs text-info">JEE percentile will be automatically converted to MHT-CET equivalent for matching.</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="score">{examType} Score {examType === "MHT-CET" ? "(out of 200)" : "(out of 300)"} (Optional)</Label>
                        <Input
                          id="score"
                          type="number"
                          placeholder={examType === "MHT-CET" ? "e.g. 145" : "e.g. 180"}
                          value={score}
                          onChange={(e) => handleScoreChange(e.target.value)}
                          className={`rounded-xl h-11 ${errors.score ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        />
                        <FieldError message={errors.score} />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="percentile">Percentile</Label>
                        <Input
                          id="percentile"
                          type="number"
                          placeholder="e.g. 92.5"
                          step="0.1"
                          max="100"
                          value={percentile}
                          onChange={(e) => handlePercentileChange(e.target.value)}
                          className={`rounded-xl h-11 ${errors.percentile ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        />
                        <FieldError message={errors.percentile} />
                        <p className="text-xs text-muted-foreground">Enter your exact percentile as shown on your {examType} scorecard.</p>
                      </div>
                    </>
                  )}

                  {/* ─── STEP 2: Preferences ─── */}
                  {step === 2 && (
                    <>
                      {/* ── Branch multi-select ── */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <Label className="text-base font-semibold">Preferred Branches</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">Select one or more branches you're interested in.</p>
                        {metaLoading ? (
                          <div className="space-y-2">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 max-h-[240px] overflow-y-auto pr-1 border rounded-xl p-2">
                            {branchesList.map((branch) => (
                              <label
                                key={branch}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedBranches.includes(branch)
                                  ? "border-primary/40 bg-primary/5"
                                  : "border-border hover:bg-muted/50"
                                  }`}
                              >
                                <Checkbox
                                  checked={selectedBranches.includes(branch)}
                                  onCheckedChange={() => toggleBranch(branch)}
                                />
                                <span className="text-sm font-medium">{branch}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        <FieldError message={errors.branches} />
                        {selectedBranches.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium">Selected ({selectedBranches.length}):</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedBranches.map((b) => (
                                <Badge
                                  key={b}
                                  variant="secondary"
                                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg text-xs"
                                  onClick={() => toggleBranch(b)}
                                >
                                  <GraduationCap className="h-3 w-3" /> {b} ✕
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── Divider ── */}
                      <div className="border-t border-border my-2" />

                      {/* ── City / District multi-select ── */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <Label className="text-base font-semibold">Preferred City / District</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">Select one or more cities. Leave empty for no preference (all cities).</p>
                        {metaLoading ? (
                          <div className="space-y-2">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 max-h-[240px] overflow-y-auto pr-1 border rounded-xl p-2">
                            {citiesList.map((city) => (
                              <label
                                key={city}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedCities.includes(city)
                                  ? "border-primary/40 bg-primary/5"
                                  : "border-border hover:bg-muted/50"
                                  }`}
                              >
                                <Checkbox
                                  checked={selectedCities.includes(city)}
                                  onCheckedChange={() => toggleCity(city)}
                                />
                                <span className="text-sm font-medium">{city}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {selectedCities.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium">Selected ({selectedCities.length}):</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedCities.map((c) => (
                                <Badge
                                  key={c}
                                  variant="secondary"
                                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg text-xs"
                                  onClick={() => toggleCity(c)}
                                >
                                  <MapPin className="h-3 w-3" /> {c} ✕
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── Divider ── */}
                      <div className="border-t border-border my-2" />

                      {/* ── College Type ── */}
                      <div className="space-y-1.5">
                        <Label>College Type</Label>
                        <Select value={collegeType} onValueChange={setCollegeType}>
                          <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {collegeTypes.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 0}
                  className="gap-2 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                {step < 2 ? (
                  <Button onClick={goNext} disabled={!canNext()} className="gap-2 rounded-xl">
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canNext()} className="gap-2 rounded-xl gradient-bg shadow-lg shadow-primary/20">
                    Get Results <Sparkles className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Free</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> MHT-CET & JEE</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Privacy-safe</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Predict;
