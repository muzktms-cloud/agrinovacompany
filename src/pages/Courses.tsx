import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Video, Users, Clock, Star, CheckCircle2, Sprout, Bug, Droplets, Wrench, BarChart3, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const courses = [
  {
    id: "smart-farming-101",
    icon: Sprout,
    title: "Smart Farming 101",
    description: "Learn the fundamentals of modern agriculture — soil prep, seed selection, seasonal planning, and sustainable practices.",
    duration: "6 hours",
    lessons: 12,
    level: "Beginner",
    topics: ["Soil Preparation", "Seed Selection", "Crop Rotation", "Water Management"],
    color: "primary",
  },
  {
    id: "pest-management",
    icon: Bug,
    title: "Pest & Disease Management",
    description: "Identify, prevent, and treat crop pests and diseases using integrated pest management (IPM) strategies.",
    duration: "4 hours",
    lessons: 8,
    level: "Intermediate",
    topics: ["Pest Identification", "Organic Pesticides", "IPM Strategies", "Biological Control"],
    color: "accent",
  },
  {
    id: "irrigation-mastery",
    icon: Droplets,
    title: "Irrigation & Water Systems",
    description: "Master drip irrigation, sprinkler systems, and smart water management for maximum efficiency.",
    duration: "5 hours",
    lessons: 10,
    level: "Intermediate",
    topics: ["Drip Irrigation Setup", "Sprinkler Systems", "Water Scheduling", "Sensor Integration"],
    color: "olive",
  },
  {
    id: "hardware-tech",
    icon: Wrench,
    title: "AgriTech Hardware Training",
    description: "Hands-on training for using sensors, drones, soil analyzers, and all the hardware we sell in our store.",
    duration: "8 hours",
    lessons: 15,
    level: "All Levels",
    topics: ["Sensor Installation", "Drone Operation", "Data Reading", "Maintenance & Troubleshooting"],
    color: "terracotta",
  },
  {
    id: "market-business",
    icon: BarChart3,
    title: "Farm Business & Marketing",
    description: "Turn your harvest into profit — pricing strategies, mandi navigation, and connecting with buyers.",
    duration: "4 hours",
    lessons: 8,
    level: "Beginner",
    topics: ["MSP Understanding", "Mandi Trading", "Direct-to-Consumer", "Record Keeping"],
    color: "primary",
  },
  {
    id: "organic-farming",
    icon: Leaf,
    title: "Organic & Sustainable Farming",
    description: "Transition to organic farming with certification guidance, natural fertilizers, and premium market access.",
    duration: "6 hours",
    lessons: 11,
    level: "Advanced",
    topics: ["Organic Certification", "Composting", "Natural Pest Control", "Premium Markets"],
    color: "accent",
  },
];

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  primary: { bg: "bg-primary/10", icon: "text-primary", badge: "bg-primary/20 text-primary" },
  accent: { bg: "bg-accent/10", icon: "text-accent", badge: "bg-accent/20 text-accent" },
  olive: { bg: "bg-olive/10", icon: "text-olive", badge: "bg-olive/20 text-olive" },
  terracotta: { bg: "bg-terracotta/10", icon: "text-terracotta", badge: "bg-terracotta/20 text-terracotta" },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Courses = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredCourses = selectedTab === "all"
    ? courses
    : courses.filter(c => c.level.toLowerCase() === selectedTab);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary/15 via-accent/10 to-olive/10 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back", "Back")}
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="bg-accent/20 text-accent border-0 mb-4">
              <BookOpen className="h-3 w-3 mr-1" />
              Learn & Grow
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Courses & <span className="text-primary">Training Packages</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Master modern farming techniques and learn to use our AgriTech tools like a pro. 
              Expert-led courses designed for South Asian farmers — from beginners to advanced practitioners.
            </p>

            {/* Pricing Cards */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex-1 rounded-xl border-2 border-primary/30 bg-card p-5 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Online</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-primary">₹500</span>
                  <span className="text-sm text-muted-foreground">/ course</span>
                </div>
                <p className="text-xs text-muted-foreground">Video lessons, quizzes & certificate</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex-1 rounded-xl border-2 border-accent/30 bg-card p-5 shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  POPULAR
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-foreground">In-Person</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-accent">₹1,000</span>
                  <span className="text-sm text-muted-foreground">/ course</span>
                </div>
                <p className="text-xs text-muted-foreground">Hands-on training at your local center</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-6 py-12">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
          key={selectedTab}
        >
          {filteredCourses.map((course) => {
            const colors = colorMap[course.color] || colorMap.primary;
            const Icon = course.icon;
            return (
              <motion.div key={course.id} variants={item}>
                <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="text-sm">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        4.8
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {course.topics.map((topic) => (
                        <div key={topic} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${colors.icon}`} />
                          <span className="text-muted-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-4 border-t border-border/50">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Video className="h-3.5 w-3.5" />
                      Online ₹500
                    </Button>
                    <Button size="sm" className="flex-1 gap-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Users className="h-3.5 w-3.5" />
                      In-Person ₹1,000
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-olive/10 border border-border/50 p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            Bundle & Save 🎓
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Get all 6 courses for <span className="font-bold text-primary">₹2,500 online</span> or{" "}
            <span className="font-bold text-accent">₹5,000 in-person</span> — that's up to 17% off!
            Perfect for new farmers or those upgrading their skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2">
              <Video className="h-4 w-4" />
              Get Online Bundle — ₹2,500
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Get In-Person Bundle — ₹5,000
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Courses;
