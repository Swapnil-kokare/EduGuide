import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import {
  Code, Cpu, Zap, Wrench, Building2, Brain, Radio, ArrowRight,
  BookOpen, ExternalLink, Lightbulb, TrendingUp, Target
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

interface BranchGuide {
  branch: string;
  icon: React.ElementType;
  description: string;
  skills: string[];
  tools: string[];
  careers: string[];
  learningPath: string[];
  avgPackage: string;
}

const branchGuides: BranchGuide[] = [
  {
    branch: "Computer Engineering",
    icon: Code,
    description: "Design, develop, and maintain software systems, web applications, and computing infrastructure. One of the most in-demand branches with excellent placement opportunities.",
    skills: ["Data Structures & Algorithms", "Object-Oriented Programming", "Database Management", "Operating Systems", "Computer Networks", "Web Development"],
    tools: ["VS Code", "Git & GitHub", "Docker", "AWS/Azure", "MySQL/PostgreSQL", "Postman"],
    careers: ["Software Developer", "Full-Stack Engineer", "DevOps Engineer", "System Architect", "Cloud Engineer", "Data Engineer"],
    learningPath: ["Learn C/C++ & Python fundamentals", "Master DSA & problem-solving on LeetCode", "Build full-stack projects (MERN/Django)", "Learn Git, Docker & cloud basics", "Contribute to open source", "Prepare for coding interviews"],
    avgPackage: "₹6-15 LPA",
  },
  {
    branch: "Computer Science",
    icon: Brain,
    description: "Focus on theoretical foundations of computing, algorithms, AI/ML, and cutting-edge research. Ideal for those interested in innovation and R&D.",
    skills: ["Machine Learning", "Artificial Intelligence", "Algorithm Design", "Computational Theory", "Natural Language Processing", "Deep Learning"],
    tools: ["Python", "TensorFlow/PyTorch", "Jupyter Notebooks", "Scikit-learn", "Kaggle", "Google Colab"],
    careers: ["ML Engineer", "Data Scientist", "AI Researcher", "Algorithm Developer", "NLP Engineer", "Computer Vision Engineer"],
    learningPath: ["Master Python and mathematics (linear algebra, stats)", "Learn ML fundamentals on Coursera/fast.ai", "Practice on Kaggle competitions", "Build AI projects with real datasets", "Study deep learning & NLP", "Publish research or build a portfolio"],
    avgPackage: "₹7-18 LPA",
  },
  {
    branch: "Information Technology",
    icon: Cpu,
    description: "Bridge between business and technology — manage IT systems, develop enterprise applications, and ensure cybersecurity.",
    skills: ["Web Development", "Database Administration", "Cybersecurity", "Cloud Computing", "Networking", "Software Testing"],
    tools: ["React/Angular", "Node.js", "AWS/GCP", "Wireshark", "Jenkins/CI-CD", "Jira"],
    careers: ["Web Developer", "IT Consultant", "Cybersecurity Analyst", "Cloud Architect", "QA Engineer", "Technical Project Manager"],
    learningPath: ["Learn HTML, CSS, JavaScript deeply", "Build responsive web applications", "Study networking & security fundamentals", "Get cloud certifications (AWS/Azure)", "Learn DevOps & CI/CD pipelines", "Build a strong portfolio of projects"],
    avgPackage: "₹5-12 LPA",
  },
  {
    branch: "Artificial Intelligence",
    icon: Brain,
    description: "Specialized in AI, ML, data science, and intelligent systems. A rapidly growing field with high demand across all industries.",
    skills: ["Deep Learning", "Computer Vision", "Reinforcement Learning", "Data Analysis", "Neural Networks", "Edge AI"],
    tools: ["Python", "TensorFlow", "OpenCV", "Hugging Face", "MLflow", "ONNX"],
    careers: ["AI Engineer", "Robotics Engineer", "Computer Vision Specialist", "AI Product Manager", "Research Scientist", "MLOps Engineer"],
    learningPath: ["Build strong math foundations", "Learn Python for data science", "Complete Andrew Ng's ML course", "Build projects in CV, NLP, or RL", "Participate in AI hackathons", "Specialize in one AI domain"],
    avgPackage: "₹8-20 LPA",
  },
  {
    branch: "Electronics & Telecommunication",
    icon: Radio,
    description: "Design electronic circuits, communication systems, and embedded devices. Essential for telecom, IoT, and semiconductor industries.",
    skills: ["Analog & Digital Electronics", "Signal Processing", "Embedded Systems", "VLSI Design", "IoT", "Communication Systems"],
    tools: ["MATLAB", "Arduino/Raspberry Pi", "Keil/STM32", "Cadence/Xilinx", "LabVIEW", "Proteus"],
    careers: ["Embedded Systems Engineer", "VLSI Designer", "Telecom Engineer", "IoT Developer", "Signal Processing Engineer", "RF Engineer"],
    learningPath: ["Master electronics fundamentals", "Learn embedded C & microcontrollers", "Build IoT projects with Arduino/ESP32", "Study signal processing & VLSI", "Get hands-on with PCB design", "Explore 5G & wireless technologies"],
    avgPackage: "₹4-10 LPA",
  },
  {
    branch: "Mechanical Engineering",
    icon: Wrench,
    description: "Design, manufacture, and maintain mechanical systems. A versatile branch with applications in automotive, aerospace, and manufacturing.",
    skills: ["CAD/CAM", "Thermodynamics", "Fluid Mechanics", "Manufacturing Processes", "FEA Analysis", "3D Printing"],
    tools: ["AutoCAD", "SolidWorks", "CATIA", "ANSYS", "MATLAB", "Fusion 360"],
    careers: ["Design Engineer", "Manufacturing Engineer", "Automotive Engineer", "HVAC Engineer", "Quality Engineer", "Production Manager"],
    learningPath: ["Master engineering drawing & CAD", "Learn SolidWorks or CATIA thoroughly", "Study thermodynamics & fluid mechanics", "Do internships in manufacturing firms", "Learn FEA/CFD simulation", "Explore robotics or 3D printing"],
    avgPackage: "₹3.5-8 LPA",
  },
  {
    branch: "Electrical Engineering",
    icon: Zap,
    description: "Work with power systems, electrical machines, control systems, and renewable energy. Critical for India's growing energy sector.",
    skills: ["Power Systems", "Control Systems", "Electrical Machines", "Power Electronics", "Renewable Energy", "PLC Programming"],
    tools: ["MATLAB/Simulink", "PSpice", "AutoCAD Electrical", "ETAP", "LabVIEW", "Arduino"],
    careers: ["Power Systems Engineer", "Control Engineer", "Electrical Design Engineer", "Renewable Energy Engineer", "Automation Engineer", "GATE/PSU roles"],
    learningPath: ["Master circuit analysis & machines", "Learn MATLAB/Simulink for simulation", "Study power systems & protection", "Prepare for GATE if targeting PSUs", "Explore PLC/SCADA for automation", "Learn about solar & wind energy systems"],
    avgPackage: "₹3.5-7 LPA",
  },
  {
    branch: "Civil Engineering",
    icon: Building2,
    description: "Plan, design, and oversee construction of infrastructure — buildings, bridges, roads, and water systems. Essential for India's infrastructure growth.",
    skills: ["Structural Analysis", "Surveying", "Construction Management", "Geotechnical Engineering", "Environmental Engineering", "Quantity Estimation"],
    tools: ["AutoCAD", "STAAD Pro", "Revit", "Primavera", "ETABS", "Google Earth Pro"],
    careers: ["Structural Engineer", "Site Engineer", "Construction Manager", "Urban Planner", "Transport Engineer", "GATE/Government roles"],
    learningPath: ["Master structural analysis & RCC design", "Learn AutoCAD & STAAD Pro", "Do site training during internships", "Study quantity surveying & estimation", "Prepare for GATE for PSU/Government jobs", "Explore green building & sustainability"],
    avgPackage: "₹3-6 LPA",
  },
];

const CareerGuidance = () => {
  const [searchParams] = useSearchParams();
  const selectedBranch = searchParams.get("branch");
  const branchRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedBranch && branchRefs.current[selectedBranch]) {
      setTimeout(() => {
        branchRefs.current[selectedBranch]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [selectedBranch]);

  return (
    <div className="py-12 md:py-20">
      {/* Hero */}
      <section className="container">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto text-center mb-16">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
            <Lightbulb className="h-4 w-4" /> Career Guidance
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Branch-Specific{" "}
            <span className="gradient-text">Career Roadmaps</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg mt-6 leading-relaxed">
            Not sure which branch to pick or what skills to learn? Explore detailed career guidance for every major engineering branch — including skills, tools, career paths, and step-by-step learning roadmaps.
          </motion.p>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { icon: BookOpen, label: "Branches Covered", value: "8+" },
            { icon: Target, label: "Skills Listed", value: "50+" },
            { icon: TrendingUp, label: "Career Paths", value: "40+" },
            { icon: Lightbulb, label: "Learning Steps", value: "48+" },
          ].map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Card className="glass text-center">
                <CardContent className="p-4">
                  <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Branch Cards */}
      <section className="container">
        <div className="space-y-8">
          {branchGuides.map((guide, idx) => (
            <motion.div
              key={guide.branch}
              ref={(el) => { branchRefs.current[guide.branch] = el; }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              custom={0}
            >
              <Card className={`glass overflow-hidden transition-all ${selectedBranch === guide.branch ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""}`}>
                <CardContent className="p-0">
                  {/* Branch Header */}
                  <div className="p-6 md:p-8 border-b border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                        <guide.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">{guide.branch}</h2>
                          <Badge variant="secondary" className="rounded-lg">{guide.avgPackage}</Badge>
                        </div>
                        <p className="text-muted-foreground mt-2 leading-relaxed">{guide.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
                    {/* Skills */}
                    <div className="p-6">
                      <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" /> Key Skills
                      </h3>
                      <ul className="space-y-2">
                        {guide.skills.map((skill) => (
                          <li key={skill} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tools */}
                    <div className="p-6">
                      <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-accent" /> Tools & Software
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {guide.tools.map((tool) => (
                          <Badge key={tool} variant="secondary" className="rounded-lg text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Careers */}
                    <div className="p-6">
                      <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-success" /> Career Paths
                      </h3>
                      <ul className="space-y-2">
                        {guide.careers.map((career) => (
                          <li key={career} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                            {career}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Learning Path */}
                    <div className="p-6">
                      <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-info" /> Learning Roadmap
                      </h3>
                      <ol className="space-y-2">
                        {guide.learningPath.map((step, i) => (
                          <li key={step} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-info/10 text-info flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mt-16">
        <div className="rounded-3xl gradient-bg p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Know Your Branch? Find Your College
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              Use our prediction tool to find the best colleges for your chosen branch based on your MHT-CET or JEE score.
            </p>
            <Link to="/predict">
              <Button size="lg" variant="secondary" className="text-base px-8 h-13 rounded-xl gap-2 font-semibold">
                Start Prediction <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerGuidance;
