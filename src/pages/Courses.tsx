import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Video, Users, Clock, Star, CheckCircle2, Sprout, Bug, Droplets, Wrench, BarChart3, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const courseData = [
  { id: "smartFarming", icon: Sprout, duration: "6", lessons: 12, level: "beginner", color: "primary", topics: ["soil", "seed", "rotation", "water"] },
  { id: "pestManagement", icon: Bug, duration: "4", lessons: 8, level: "intermediate", color: "accent", topics: ["pestId", "organic", "ipm", "biological"] },
  { id: "irrigation", icon: Droplets, duration: "5", lessons: 10, level: "intermediate", color: "olive", topics: ["drip", "sprinkler", "scheduling", "sensors"] },
  { id: "hardware", icon: Wrench, duration: "8", lessons: 15, level: "all", color: "terracotta", topics: ["install", "drone", "data", "maintenance"] },
  { id: "business", icon: BarChart3, duration: "4", lessons: 8, level: "beginner", color: "primary", topics: ["msp", "mandi", "direct", "records"] },
  { id: "organic", icon: Leaf, duration: "6", lessons: 11, level: "advanced", color: "accent", topics: ["certification", "compost", "natural", "premium"] },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
  primary: { bg: "bg-primary/10", icon: "text-primary" },
  accent: { bg: "bg-accent/10", icon: "text-accent" },
  olive: { bg: "bg-olive/10", icon: "text-olive" },
  terracotta: { bg: "bg-terracotta/10", icon: "text-terracotta" },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Courses = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredCourses = selectedTab === "all"
    ? courseData
    : courseData.filter(c => c.level === selectedTab || (selectedTab === "all" && c.level === "all"));

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-br from-primary/15 via-accent/10 to-olive/10 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="bg-accent/20 text-accent border-0 mb-4">
              <BookOpen className="h-3 w-3 mr-1" />
              {t("coursesPage.tagline")}
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("coursesPage.heroTitle")} <span className="text-primary">{t("coursesPage.heroTitleHighlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              {t("coursesPage.heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <motion.div whileHover={{ scale: 1.03 }} className="flex-1 rounded-xl border-2 border-primary/30 bg-card p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">{t("coursesPage.online")}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-primary">₹500</span>
                  <span className="text-sm text-muted-foreground">{t("coursesPage.perCourse")}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("coursesPage.onlineDesc")}</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} className="flex-1 rounded-xl border-2 border-accent/30 bg-card p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  {t("coursesPage.popular")}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-foreground">{t("coursesPage.inPerson")}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-accent">₹1,000</span>
                  <span className="text-sm text-muted-foreground">{t("coursesPage.perCourse")}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("coursesPage.inPersonDesc")}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">{t("coursesPage.allCourses")}</TabsTrigger>
            <TabsTrigger value="beginner">{t("coursesPage.levels.beginner")}</TabsTrigger>
            <TabsTrigger value="intermediate">{t("coursesPage.levels.intermediate")}</TabsTrigger>
            <TabsTrigger value="advanced">{t("coursesPage.levels.advanced")}</TabsTrigger>
          </TabsList>
        </Tabs>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={container} initial="hidden" animate="show" key={selectedTab}>
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
                        {t(`coursesPage.levels.${course.level}`)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{t(`coursesPage.list.${course.id}.title`)}</CardTitle>
                    <CardDescription className="text-sm">{t(`coursesPage.list.${course.id}.description`)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration} {t("coursesPage.hours")}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course.lessons} {t("coursesPage.lessons")}
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
                          <span className="text-muted-foreground">{t(`coursesPage.list.${course.id}.topics.${topic}`)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-4 border-t border-border/50">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Video className="h-3.5 w-3.5" />
                      {t("coursesPage.online")} ₹500
                    </Button>
                    <Button size="sm" className="flex-1 gap-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {t("coursesPage.inPerson")} ₹1,000
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div className="mt-16 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-olive/10 border border-border/50 p-8 md:p-12 text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t("coursesPage.bundleTitle")} 🎓
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            {t("coursesPage.bundleDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2">
              <Video className="h-4 w-4" />
              {t("coursesPage.bundleOnline")} — ₹2,500
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              {t("coursesPage.bundleInPerson")} — ₹5,000
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Courses;
