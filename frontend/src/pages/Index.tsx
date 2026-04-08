import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap, Target, BarChart3, ArrowRight, Sparkles,
  CheckCircle2, TrendingUp, Clock, Quote, ChevronRight,
  BookOpen, Award, MapPin, Lightbulb, Brain, MessageSquareHeart,
  Code, Cpu, Zap, Wrench, Building2, Radio, ExternalLink, FileCheck2, FileText, ListChecks, MousePointerClick
} from "lucide-react";
import { motion } from "framer-motion";


const features = [
  {
    icon: Target,
    title: "Smart Predictions",
    description: "Accurate college predictions based on your MHT-CET or JEE score with real cutoff data.",
  },
  {
    icon: BarChart3,
    title: "Category-wise Cutoffs",
    description: "Compare cutoffs across Open, OBC, SC, ST, NT, EWS categories for precise results.",
  },
  {
    icon: Lightbulb,
    title: "Career Guidance",
    description: "Branch-specific skills, tools, career paths, and learning roadmaps for students.",
  },
  {
    icon: Sparkles,
    title: "Dual Exam Support",
    description: "Works with both MHT-CET and JEE scores with automatic percentile conversion.",
  },
];

const capProcessStages = [
  {
    num: "01",
    title: "Read the brochure and register",
    desc: "CET Cell first releases the official brochure. Then candidates complete the online CAP registration form and upload the required documents.",
    icon: FileText,
    cue: "Brochure + CAP registration",
  },
  {
    num: "02",
    title: "Verify documents and check merit",
    desc: "After verification through ARC or the prescribed scrutiny mode, CET Cell publishes the provisional merit list, grievance window, and final merit list.",
    icon: FileCheck2,
    cue: "Verification + merit list",
  },
  {
    num: "03",
    title: "Fill the option form carefully",
    desc: "Before each CAP round, the seat matrix is published. Candidates then submit the online option form in descending order of preference.",
    icon: ListChecks,
    cue: "Seat matrix + choices",
  },
  {
    num: "04",
    title: "Accept allotment and report",
    desc: "Once allotment is declared, candidates accept the seat, complete seat-confirmation steps, pay the fee if required, and report to the allotted institute.",
    icon: MousePointerClick,
    cue: "Allotment + reporting",
  },
];

const capRoundRules = [
  "Round I first-preference allotments are auto-freezed and become final after acceptance.",
  "Candidates accepting a lower preference may remain eligible for betterment in later rounds, subject to CET Cell round rules.",
];

const officialCapLinks = [
  {
    label: "Admission Portal",
    href: "https://cetcell.mahacet.org/cap-_2025-26/",
  },
  {
    label: "UG/PG Brochure 2025-26",
    href: "https://cetcell.mahacet.org/wp-content/uploads/2023/12/Information_Brochure_UG_PG_2025_26_Final_02_07_2025.pdf",
  },
];

const branches = [
  { name: "Computer Engineering", icon: Code },
  { name: "Computer Science", icon: Brain },
  { name: "Information Technology", icon: Cpu },
  { name: "AI & Data Science", icon: Brain },
  { name: "Electronics & Telecom", icon: Radio },
  { name: "Mechanical Engineering", icon: Wrench },
  { name: "Electrical Engineering", icon: Zap },
  { name: "Civil Engineering", icon: Building2 },
  { name: "Artificial Intelligence", icon: Brain },
];

const testimonials = [
  { name: "Aarav Patil", college: "COEP Pune", text: "EduGuide helped me find the perfect college. The category-wise cutoff comparison was a game-changer!", percentile: "96.5" },
  { name: "Sneha Deshmukh", college: "VJTI Mumbai", text: "I used my JEE score and EduGuide converted it perfectly. Got into my dream college!", percentile: "98.2" },
  { name: "Rohan Joshi", college: "PICT Pune", text: "The career guidance section helped me decide between CS and IT. Highly recommend!", percentile: "91.3" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-background" />
        <div className="absolute top-10 left-10 w-80 h-80 bg-primary/12 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px]" />

        <div className="container relative py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary mb-6">
              <GraduationCap className="h-4 w-4" />
              Career Path & College Suggestion Portal
              <ChevronRight className="h-3 w-3" />
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              <span className="gradient-text">EduGuide</span> — Find Your
              Perfect College
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Predict your best-fit engineering colleges in Maharashtra using MHT-CET or JEE scores. Get cutoff comparisons, career guidance — all for free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link to="/predict">
                <Button size="lg" className="gap-2 text-base px-8 h-13 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Start Prediction
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/career-guidance">
                <Button variant="outline" size="lg" className="text-base px-8 h-13 rounded-xl gap-2">
                  <Brain className="h-4 w-4" />
                  Career Guidance
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 mt-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-success" /> Free</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-success" /> MHT-CET & JEE</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-success" /> Instant results</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
              <Sparkles className="h-3 w-3" /> Features
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Why Choose EduGuide?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for a confident engineering career decision.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="h-full glass card-hover group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-5 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How CAP Process Works */}
      <section id="how-it-works" className="py-20 bg-card/50">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Clock className="h-3 w-3" /> Official CET Cell Flow
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold text-foreground">
              How CAP Process Works
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground text-lg max-w-3xl mx-auto">
              This follows the official State CET Cell admission sequence for A.Y. 2025-26. Scroll through the stages to understand what happens before and during CAP rounds.
            </motion.p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {officialCapLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4 text-primary" />
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {capProcessStages.map((s, i) => (
              <motion.div
                key={s.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="min-w-[280px] max-w-[320px] flex-1 snap-start"
              >
                <Card className="h-full glass border-primary/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="text-xs font-mono text-primary font-bold tracking-widest">STAGE {s.num}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{s.cue}</p>
                      </div>
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <s.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mt-8">
            {capRoundRules.map((rule) => (
              <Card key={rule} className="glass">
                <CardContent className="p-5 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{rule}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Branches We Cover — Clickable */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Explore Engineering Branches
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Click any branch to explore career guidance, skills, tools, and roadmaps.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {branches.map((b, i) => (
              <motion.div key={b.name} variants={fadeUp} custom={i}>
                <Link
                  to={`/career-guidance?branch=${encodeURIComponent(b.name)}`}
                  className="block"
                >
                  <Card className="glass card-hover group cursor-pointer transition-all hover:border-primary/40">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                        <b.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{b.name}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-auto transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success mb-4">
              <Quote className="h-3 w-3" /> Student Stories
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Trusted by Students
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="h-full glass card-hover">
                  <CardContent className="p-6">
                    <Quote className="h-5 w-5 text-primary/30 mb-3" />
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {t.college} · {t.percentile}%ile
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback CTA */}
      <section className="py-16">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              We'd Love Your Feedback
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Help us improve EduGuide by sharing your experience.
            </p>
            <Link to="/feedback">
              <Button size="lg" variant="outline" className="rounded-xl gap-2 px-8 h-12">
                <MessageSquareHeart className="h-5 w-5" />
                Share Your Feedback
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl gradient-bg p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <TrendingUp className="h-10 w-10 text-primary-foreground/60 mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Ready to Find Your College?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
                Enter your score and get personalized college recommendations — completely free.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/predict">
                  <Button size="lg" variant="secondary" className="text-base px-10 h-13 rounded-xl gap-2 font-semibold shadow-lg">
                    Start Your Prediction
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/career-guidance">
                  <Button size="lg" variant="secondary" className="text-base px-10 h-13 rounded-xl gap-2 font-semibold shadow-lg bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/30">
                    Explore Careers
                    <Lightbulb className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
