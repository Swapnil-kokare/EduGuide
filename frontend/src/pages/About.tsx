import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  GraduationCap, Target, Users, Lightbulb, ArrowRight,
  Shield, Database, Zap, HelpCircle, MapPin,
  BarChart3, CheckCircle2, Brain
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const values = [
  { icon: GraduationCap, title: "Data-Driven", desc: "Predictions based on real MHT-CET and JEE cutoff data sourced from Maharashtra's Directorate of Technical Education (DTE)." },
  { icon: Target, title: "Personalized", desc: "Recommendations filtered by exam type, category, preferred branches, cities, and college types — not generic lists." },
  { icon: Users, title: "Student-First", desc: "Built by engineering students who went through the same process. Completely free with no hidden costs." },
  { icon: Lightbulb, title: "Career Guidance", desc: "Beyond college predictions — get branch-specific skill recommendations, tools, and career roadmaps for first-year students." },
];

const objectives = [
  "Develop a web-based platform that predicts engineering colleges based on MHT-CET percentile or JEE score.",
  "Simplify cutoff comparison (branch-wise and category-wise).",
  "Reduce confusion during CAP (Centralized Admission Process) rounds.",
  "Provide first-year career guidance with branch-specific skill recommendations.",
];

const techStack = [
  { icon: Zap, title: "Instant Processing", desc: "Client-side prediction engine delivers results in milliseconds with no server delays." },
  { icon: Shield, title: "Privacy First", desc: "Your data stays in your browser. We don't store or share any personal information." },
  { icon: Database, title: "Real Cutoff Data", desc: "Curated database of 500+ colleges with cutoffs from previous MHT-CET admission rounds, category-wise." },
  { icon: BarChart3, title: "Smart Matching", desc: "Our algorithm calculates match scores with category-wise cutoff adjustments and JEE-to-MHT-CET conversion." },
];

const faqs = [
  { q: "How accurate are the predictions?", a: "Our predictions are based on real cutoff data from previous MHT-CET admission rounds. While cutoffs vary year to year, our match percentages give you a strong indication of your chances. Category-wise adjustments further improve accuracy." },
  { q: "Can I use JEE scores instead of MHT-CET?", a: "Yes! EduGuide supports both MHT-CET and JEE scores. When you select JEE, our engine automatically converts your JEE percentile to an equivalent MHT-CET percentile for accurate college matching." },
  { q: "How does category-wise cutoff work?", a: "Different reservation categories (OBC, SC, ST, NT, SBC, EWS) have different cutoff thresholds. EduGuide applies category-specific adjustments to cutoffs, giving you more accurate admission probability based on your reservation status." },
  { q: "Is my data safe?", a: "Absolutely. All processing happens locally in your browser. We don't collect, store, or transmit any of your personal information. There are no accounts, cookies, or tracking." },
  { q: "Which colleges are included?", a: "We cover 500+ engineering colleges across Maharashtra, including top government institutions like COEP, VJTI, VNIT, WCE, and leading private colleges across Pune, Mumbai, Nagpur, and other cities." },
  { q: "What is the career guidance section?", a: "EduGuide includes detailed career roadmaps for every major engineering branch — covering key skills, tools & software, career paths, average packages, and step-by-step learning roadmaps to help first-year students start strong." },
  { q: "How are match percentages calculated?", a: "We compare your percentile (with category adjustment) against each college's cutoff. Scores above the cutoff get high matches (75-98%), close scores (within 5 percentile points) get 50-75%, and larger gaps result in lower scores." },
  { q: "Is this free to use?", a: "Yes, completely free! EduGuide is a student project built to help MHT-CET and JEE aspirants. There are no paid features, ads, or premium tiers." },
];

const About = () => {
  return (
    <div className="py-12 md:py-20">
      {/* Hero */}
      <section className="container">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto text-center mb-20">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <GraduationCap className="h-4 w-4" /> About EduGuide
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Career Path & College Suggestion{" "}
            <span className="gradient-text">Portal</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg mt-6 leading-relaxed">
            Every year, lakhs of students appear for MHT-CET and JEE and face the overwhelming task of choosing from hundreds of colleges across Maharashtra. EduGuide simplifies this by matching your score and preferences with real cutoff data, providing category-wise comparisons and career guidance — instantly and for free.
          </motion.p>
        </motion.div>
      </section>

      {/* Objectives */}
      <section className="container mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="glass overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Our Objectives</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    EduGuide was built to democratize the admission guidance process and reduce stress for 12th Science students during one of the most important decisions of their academic career.
                  </p>
                  <div className="space-y-3">
                    {objectives.map((item) => (
                      <div key={item} className="flex items-start gap-3 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Expected Outcomes */}
      <section className="container mb-20">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-3">Expected Outcomes</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">What EduGuide delivers for students</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {[
            { icon: Database, title: "Eligible Colleges Display", desc: "A functional website that displays eligible colleges based on percentile, category, branch, and location preferences." },
            { icon: BarChart3, title: "Admission Probability", desc: "Admission probability prediction using previous year cutoff data with category-wise adjustments for accurate results." },
            { icon: Brain, title: "Career Guidance Section", desc: "A comprehensive career guidance section suggesting technical skills, tools, and learning paths for every engineering branch." },
            { icon: Target, title: "Better Decisions", desc: "Improved decision-making and reduced stress for 12th Science students during the crucial college admission process." },
          ].map((item, i) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Card className="h-full glass card-hover group">
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container mb-20">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">What Makes Us Different</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {values.map((item, i) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Card className="h-full glass card-hover group">
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Under the Hood */}
      <section className="container mb-20">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">Under the Hood</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {techStack.map((item, i) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Card className="h-full glass card-hover">
                <CardContent className="p-6">
                  <item.icon className="h-6 w-6 text-accent mb-3" />
                  <h3 className="font-display font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-info/10 px-4 py-1.5 text-sm font-medium text-info mb-4">
              <HelpCircle className="h-3 w-3" /> FAQ
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-5 bg-card/50">
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="container">
        <div className="rounded-3xl gradient-bg p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Start Your College Search
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of MHT-CET and JEE students who found their ideal college through EduGuide.
            </p>
            <Link to="/predict">
              <Button size="lg" variant="secondary" className="text-base px-8 h-13 rounded-xl gap-2 font-semibold">
                Get Predictions <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
