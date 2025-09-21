import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { HTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import SahayakLandingPage from './landingpage';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// UTILITIES
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { cva, type VariantProps } from "class-variance-authority"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// MULTILINGUAL TRANSLATIONS
const translations = {
  en: {
    welcomeBack: "Welcome back",
    unlockFuture: "Let's unlock your bright future.",
    dashboard: "Dashboard",
    recommendations: "Recommendations",
    suggestions: "Suggestions",
    quiz: "Quiz",
    careerPaths: "Career Paths",
    sahayakAI: "Sahayak AI",
    strengths: "Strengths (Based on Subjects)",
    interests: "Interests",
    quizToDiscover: "Take the quiz to discover your strengths.",
    tellUsInterests: "Tell us your interests in the quiz.",
    takeQuizButton: "Take Quiz to Get Recommendations",
    aptitudeScore: "Aptitude Score",
    basedOnQuiz: "Based on your quiz",
    profileCompletion: "Profile Completion",
    completeProfileFor: "Complete profile for +25%",
    recommendationsAwait: "Your Recommendations Await",
    completeQuizToUnlock: "Complete the quiz to unlock your personalized career and education plan.",
    exploreCareerPath: "Explore Career Path",
    goodFit: "Why it's a good fit:",
    careerDiscoveryQuiz: "Career Discovery Quiz",
    answerQuestions: "Answer these questions to unlock your personalized path.",
    questionOf: "Question {current} of {total}",
    next: "Next",
    selectOption: "Select an option",
    loadingAnalysis: "Analyzing your academic strengths...",
    loadingEvaluation: "Evaluating your interests and hobbies...",
    loadingConnecting: "Connecting them to potential career paths...",
    loadingCrafting: "Crafting your personalized roadmap...",
    errorGeneratingRecs: "Sorry, I couldn't generate recommendations.",
    careerRoadmaps: "Your Career Roadmaps",
    generatePlanHere: 'Go to "Recommendations" and click "Explore Career Path" on a suggestion to generate a plan here.',
    avgSalary: "Avg. Salary:",
    timeframe: "Timeframe:",
    roadmap: "Roadmap:",
    buildingRoadmap: "Building your detailed career roadmap...",
    errorGeneratingPath: "Sorry, I couldn't generate the career path.",
    aiChatTitle: "Sahayak AI",
    aiChatDescription: "Your personal AI career assistant.",
    askAbout: "Ask about scholarships, careers...",
    completeProfileTitle: "Complete Your Profile",
    completeProfileDescription: "This helps us personalize your recommendations.",
    fullName: "Full Name",
    gradeClass: "Grade/Class",
    location: "Location",
    interestsComma: "Interests (comma-separated)",
    strengthsComma: "Strengths (comma-separated)",
    cancel: "Cancel",
    saveProfile: "Save Profile",
    quizQuestions: [
        { id: 'name', text: 'To start, what is your full name?', type: 'text', placeholder: 'e.g., Priya Sharma' },
        { id: 'grade', text: 'Which grade are you in, or what is your current educational status?', type: 'select', options: ['10th Grade', '11th Grade', '12th Grade', 'Completed 12th', 'In College'] },
        { id: 'favoriteSubject', text: 'Think about your classes. Which subject do you enjoy the most, and why?', type: 'text', placeholder: 'e.g., "Physics, because I love solving problems."' },
        { id: 'learningStyle', text: 'How do you learn best?', type: 'radio', options: ['By seeing (diagrams, videos)', 'By doing (experiments, projects)', 'By reading (textbooks, articles)', 'By listening (lectures, discussions)'] },
        { id: 'freeTime', text: 'What do you genuinely enjoy doing in your free time?', type: 'text', placeholder: 'e.g., Building apps, painting, debating, playing guitar' },
        { id: 'problemSolving', text: 'When faced with a difficult challenge, what is your first instinct?', type: 'radio', options: ['Analyze it with logic and data', 'Brainstorm creative and new solutions', 'Organize a plan and follow it step-by-step', 'Discuss it with others to find a solution'] },
        { id: 'workEnvironment', text: 'Imagine your future workplace. What feels right?', type: 'radio', options: ['A busy, collaborative team environment', 'A quiet, focused space for independent work', 'A dynamic, flexible and creative studio', 'A stable, structured, and predictable office'] },
        { id: 'careerValues', text: 'What is MOST important to you in a future career?', type: 'radio', options: ['High earning potential and financial security', 'Making a positive impact on society', 'Work-life balance and personal time', 'Creativity, innovation, and self-expression'] },
        { id: 'interestedFields', text: 'Which of these broad fields sparks your curiosity the most?', type: 'select', options: ['Technology & Engineering', 'Healthcare & Medicine', 'Business & Finance', 'Arts & Design', 'Law & Public Policy', 'Sciences & Research'] },
        { id: 'dreamGoal', text: 'Don’t be shy! What is a dream goal or achievement you imagine for yourself?', type: 'text', placeholder: 'e.g., "Lead a team at Google," "Start my own design firm"' }
    ],
  },
  hi: {
    welcomeBack: "वापसी पर स्वागत है",
    unlockFuture: "आइए आपके उज्ज्वल भविष्य को अनलॉक करें।",
    dashboard: "डैशबोर्ड",
    recommendations: "सिफारिशें",
    suggestions: "सुझाव",
    quiz: "प्रश्नोत्तरी",
    careerPaths: "कैरियर पथ",
    sahayakAI: "सहायक AI",
    strengths: "शक्तियां (विषयों पर आधारित)",
    interests: "रूचियाँ",
    quizToDiscover: "अपनी शक्तियों को खोजने के लिए प्रश्नोत्तरी दें।",
    tellUsInterests: "प्रश्नोत्तरी में हमें अपनी रुचियों के बारे में बताएं।",
    takeQuizButton: "सिफारिशें प्राप्त करने के लिए प्रश्नोत्तरी दें",
    aptitudeScore: "एप्टीट्यूड स्कोर",
    basedOnQuiz: "आपकी प्रश्नोत्तरी पर आधारित",
    profileCompletion: "प्रोफ़ाइल पूर्णता",
    completeProfileFor: " +25% के लिए प्रोफ़ाइल पूरी करें",
    recommendationsAwait: "आपकी सिफारिशें प्रतीक्षारत हैं",
    completeQuizToUnlock: "अपनी व्यक्तिगत कैरियर और शिक्षा योजना को अनलॉक करने के लिए प्रश्नोत्तरी पूरी करें।",
    exploreCareerPath: "कैरियर पथ का अन्वेषण करें",
    goodFit: "यह एक अच्छा विकल्प क्यों है:",
    careerDiscoveryQuiz: "कैरियर खोज प्रश्नोत्तरी",
    answerQuestions: "अपना व्यक्तिगत पथ अनलॉक करने के लिए इन सवालों के जवाब दें।",
    questionOf: "प्रश्न {current} / {total}",
    next: "अगला",
    selectOption: "एक विकल्प चुनें",
    loadingAnalysis: "आपकी शैक्षणिक शक्तियों का विश्लेषण किया जा रहा है...",
    loadingEvaluation: "आपकी रुचियों और शौक का मूल्यांकन किया जा रहा है...",
    loadingConnecting: "उन्हें संभावित कैरियर पथों से जोड़ा जा रहा है...",
    loadingCrafting: "आपका व्यक्तिगत रोडमैप तैयार किया जा रहा है...",
    errorGeneratingRecs: "क्षमा करें, मैं सिफारिशें नहीं बना सका।",
    careerRoadmaps: "आपके कैरियर रोडमैप",
    generatePlanHere: 'एक योजना बनाने के लिए "सिफारिशें" पर जाएं और एक सुझाव पर "कैरियर पथ का अन्वेषण करें" पर क्लिक करें।',
    avgSalary: "औसत वेतन:",
    timeframe: "समय-सीमा:",
    roadmap: "रोडमैप:",
    buildingRoadmap: "आपका विस्तृत कैरियर रोडमैप बनाया जा रहा है...",
    errorGeneratingPath: "क्षमा करें, मैं कैरियर पथ नहीं बना सका।",
    aiChatTitle: "सहायक AI",
    aiChatDescription: "आपका व्यक्तिगत AI कैरियर सहायक।",
    askAbout: "छात्रवृत्ति, करियर के बारे में पूछें...",
    completeProfileTitle: "अपनी प्रोफ़ाइल पूरी करें",
    completeProfileDescription: "यह हमें आपकी सिफारिशों को व्यक्तिगत बनाने में मदद करता है।",
    fullName: "पूरा नाम",
    gradeClass: "कक्षा/ग्रेड",
    location: "स्थान",
    interestsComma: "रूचियाँ (अल्पविराम से अलग)",
    strengthsComma: "शक्तियां (अल्पविराम से अलग)",
    cancel: "रद्द करें",
    saveProfile: "प्रोफ़ाइल सहेजें",
    quizQuestions: [
        { id: 'name', text: 'शुरू करने के लिए, आपका पूरा नाम क्या है?', type: 'text', placeholder: 'जैसे, प्रिया शर्मा' },
        { id: 'grade', text: 'आप किस कक्षा में हैं, या आपकी वर्तमान शैक्षिक स्थिति क्या है?', type: 'select', options: ['10वीं कक्षा', '11वीं कक्षा', '12वीं कक्षा', '12वीं पूरी की', 'कॉलेज में'] },
        { id: 'favoriteSubject', text: 'अपनी कक्षाओं के बारे में सोचें। आपको कौन सा विषय सबसे ज्यादा पसंद है, और क्यों?', type: 'text', placeholder: 'जैसे, "भौतिकी, क्योंकि मुझे समस्याएं हल करना पसंद है।"' },
        { id: 'learningStyle', text: 'आप सबसे अच्छे तरीके से कैसे सीखते हैं?', type: 'radio', options: ['देखकर (आरेख, वीडियो)', 'करके (प्रयोग, परियोजनाएं)', 'पढ़कर (पाठ्यपुस्तकें, लेख)', 'सुनकर (व्याख्यान, चर्चा)'] },
        { id: 'freeTime', text: 'आप अपने खाली समय में वास्तव में क्या करना पसंद करते हैं?', type: 'text', placeholder: 'जैसे, ऐप बनाना, पेंटिंग, बहस, गिटार बजाना' },
        { id: 'problemSolving', text: 'जब एक कठिन चुनौती का सामना करना पड़ता है, तो आपकी पहली वृत्ति क्या होती है?', type: 'radio', options: ['तर्क और डेटा के साथ इसका विश्लेषण करें', 'रचनात्मक और नए समाधानों पर विचार करें', 'एक योजना बनाएं और उसका चरण-दर-चरण पालन करें', 'समाधान खोजने के लिए दूसरों के साथ चर्चा करें'] },
        { id: 'workEnvironment', text: 'अपने भविष्य के कार्यस्थल की कल्पना करें। क्या सही लगता है?', type: 'radio', options: ['एक व्यस्त, सहयोगी टीम का माहौल', 'स्वतंत्र काम के लिए एक शांत, केंद्रित स्थान', 'एक गतिशील, लचीला और रचनात्मक स्टूडियो', 'एक स्थिर, संरचित और अनुमानित कार्यालय'] },
        { id: 'careerValues', text: 'भविष्य के करियर में आपके लिए सबसे महत्वपूर्ण क्या है?', type: 'radio', options: ['उच्च कमाई की क्षमता और वित्तीय सुरक्षा', 'समाज पर सकारात्मक प्रभाव डालना', 'कार्य-जीवन संतुलन और व्यक्तिगत समय', 'रचनात्मकता, नवीनता और आत्म-अभिव्यक्ति'] },
        { id: 'interestedFields', text: 'इनमें से कौन सा व्यापक क्षेत्र आपकी जिज्ञासा को सबसे अधिक जगाता है?', type: 'select', options: ['प्रौद्योगिकी और इंजीनियरिंग', 'स्वास्थ्य सेवा और चिकित्सा', 'व्यापार और वित्त', 'कला और डिजाइन', 'कानून और सार्वजनिक नीति', 'विज्ञान और अनुसंधान'] },
        { id: 'dreamGoal', text: 'शर्माएं नहीं! आप अपने लिए क्या सपना या उपलब्धि की कल्पना करते हैं?', type: 'text', placeholder: 'जैसे, "Google में एक टीम का नेतृत्व करना," "अपनी खुद की डिजाइन फर्म शुरू करना"' }
    ],
  }
};


// INLINE SVG ICONS
const Moon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const Sun = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);
const LayoutDashboard = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const Lightbulb = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);
const FileQuestion = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2"/><path d="M12 17h.01"/></svg>
);
const Map = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
);
const MessageCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
);
const Send = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const User = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const Bot = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);
const BookOpen = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const Briefcase = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
const Sparkles = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 3.8-3.8 1.9 3.8 1.9L12 14.4l1.9-3.8 3.8-1.9-3.8-1.9L12 3z"/><path d="M5 8.5l.9-1.8 1.8-.9-1.8-.9L5 3l-.9 1.8-1.8.9 1.8.9L5 8.5z"/><path d="M19 15.5l.9-1.8 1.8-.9-1.8-.9-.9-1.8-.9 1.8-1.8.9 1.8.9.9 1.8z"/></svg>
);


// UI COMPONENTS
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
));
Label.displayName = "Label";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// DATA STRUCTURES & CONSTANTS
const initialStudentProfile = {
    name: "Student",
    class: "10th Grade",
    location: "India",
    aptitudeScore: 0,
    profileCompletion: 25,
    goals: [],
    interests: [],
    strengths: [],
};

type Recommendation = {
    type: string;
    title: string;
    description: string;
    reasoning?: string;
};

type CareerPathStep = {
    stage: string;
    description: string;
    details: string[];
};

type CareerPath = {
    title: string;
    avgSalary: string;
    timeframe: string;
    steps: CareerPathStep[];
};

type Tab = 'Dashboard' | 'Recommendations' | 'Quiz' | 'Career Paths' | 'Sahayak AI';

const TABS: { id: Tab; labelKey: keyof typeof translations.en; mobileLabelKey?: keyof typeof translations.en, icon: React.ComponentType<any> }[] = [
    { id: 'Dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { id: 'Recommendations', labelKey: 'recommendations', mobileLabelKey: 'suggestions', icon: Lightbulb },
    { id: 'Quiz', labelKey: 'quiz', icon: FileQuestion },
    { id: 'Career Paths', labelKey: 'careerPaths', icon: Map },
    { id: 'Sahayak AI', labelKey: 'sahayakAI', icon: MessageCircle },
];

const loadingMessages = [
    { icon: BookOpen, text: "Analyzing your academic strengths..." },
    { icon: Lightbulb, text: "Evaluating your interests and hobbies..." },
    { icon: Briefcase, text: "Connecting them to potential career paths..." },
    { icon: Sparkles, text: "Crafting your personalized roadmap..." },
];


// SAHAYAK COMPONENTS
const Dashboard = ({ profile, onTakeQuiz, t }: { profile: any, onTakeQuiz: () => void, t: (key: string) => string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="dashboard">
     <h2 className="text-2xl font-bold mb-2 md:hidden">{t('welcomeBack')}, {profile.name}! 👋</h2>
     <p className="text-muted-foreground mb-6 md:hidden">{t('unlockFuture')}</p>
     <div className="mb-6">
        <Card>
            <CardHeader><CardTitle className="text-2xl">{profile.name}</CardTitle><CardDescription>{profile.class} • {profile.location}</CardDescription></CardHeader>
            <CardContent><div className="space-y-4"><div><h4 className="font-semibold text-sm mb-2">{t('strengths')}</h4><div className="flex flex-wrap gap-2">{profile.strengths.length > 0 && profile.strengths[0] !== '' ? profile.strengths.map((strength: string, i: number) => <Badge key={i}>{strength}</Badge>) : <p className="text-xs text-muted-foreground">{t('quizToDiscover')}</p>}</div></div><div><h4 className="font-semibold text-sm mb-2">{t('interests')}</h4><div className="flex flex-wrap gap-2">{profile.interests.length > 0 && profile.interests[0] !== '' ? profile.interests.map((interest: string, i: number) => <Badge key={i} variant="secondary">{interest}</Badge>) : <p className="text-xs text-muted-foreground">{t('tellUsInterests')}</p>}</div></div></div></CardContent>
            <CardFooter><Button onClick={onTakeQuiz}>{t('takeQuizButton')}</Button></CardFooter>
        </Card>
     </div>
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('aptitudeScore')}</CardTitle><Sparkles className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{profile.aptitudeScore > 0 ? `${profile.aptitudeScore}%` : 'N/A'}</div><p className="text-xs text-muted-foreground">{t('basedOnQuiz')}</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('profileCompletion')}</CardTitle><User className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{profile.profileCompletion}%</div><p className="text-xs text-muted-foreground">{t('completeProfileFor')}</p></CardContent></Card>
    </div>
  </motion.div>
);

const Recommendations = ({ recommendations, onExplorePath, t }: { recommendations: Recommendation[]; onExplorePath: (title: string) => void; t: (key: string) => string }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="recommendations">
        {recommendations.length === 0 ? (
            <div className="text-center py-10 bg-muted/50 rounded-lg"><FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" /><h3 className="mt-4 text-lg font-medium">{t('recommendationsAwait')}</h3><p className="mt-1 text-sm text-muted-foreground">{t('completeQuizToUnlock')}</p></div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((rec, i) => (
                    <Card key={i}><CardHeader><div><Badge variant="outline" className="mb-2">{rec.type}</Badge><CardTitle>{rec.title}</CardTitle></div></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">{rec.description}</p>{rec.reasoning && (<div className="p-3 bg-primary/5 border border-primary/20 rounded-md"><p className="text-sm font-semibold text-primary mb-1">{t('goodFit')}</p><p className="text-xs text-primary/80">{rec.reasoning}</p></div>)}</CardContent><CardFooter><Button size="sm" onClick={() => onExplorePath(rec.title)}>{t('exploreCareerPath')}</Button></CardFooter></Card>
                ))}
            </div>
        )}
    </motion.div>
);

const Quiz = ({ onQuizComplete, t, language }: { onQuizComplete: (recommendations: Recommendation[], studentData: any) => void; t: (key: string, options?: any) => string; language: 'en' | 'hi' }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState('');

    const quizQuestions = translations[language].quizQuestions;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    
    useEffect(() => {
        setInputValue(answers[currentQuestion.id] || '');
    }, [currentQuestionIndex, answers, currentQuestion.id]);

    const handleAnswer = (answer: string) => {
        if (!answer || (typeof answer === 'string' && !answer.trim())) return;
        const newAnswers = { ...answers, [currentQuestion.id]: answer };
        setAnswers(newAnswers);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmitQuiz(newAnswers);
        }
    };
    
    const handleSubmitQuiz = useCallback(async (finalAnswers: Record<string, string>) => {
        setIsLoading(true);
        setError('');
        
        const systemPrompt = `Act as Sahayak, an expert career and education counselor for students in India. A student has just completed a quiz. Based on their answers, generate 4-5 personalized, motivational, and student-friendly recommendations. Respond in the language: ${language === 'hi' ? 'Hindi' : 'English'}. The recommendations must cover:
1.  The best academic stream or degree path.
2.  A potential career path roadmap (Course -> Exams -> Jobs).
3.  Skill development activities.
For each recommendation, provide a title, a short description, its type (e.g., 'Stream/Path', 'Career Roadmap', 'Skill to Build'), and a brief 'reasoning' explaining why it's a good fit. Ensure the output is a valid JSON array matching the provided schema.`;

        const userQuery = `Student's Quiz Answers: ${JSON.stringify(finalAnswers, null, 2)}`;

        const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json",
                responseSchema: { type: "ARRAY", items: { type: "OBJECT", properties: { "type": { "type": "STRING" }, "title": { "type": "STRING" }, "description": { "type": "STRING" }, "reasoning": { "type": "STRING" } }, required: ["type", "title", "description", "reasoning"] } }
            }
        };
        
        const apiUrl = '/api/gemini';

        try {
            const response = await fetch(apiUrl, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ payload, type: 'quiz' })
            });
            if (!response.ok) { 
                const errorBody = await response.json().catch(() => ({})); 
                throw new Error(errorBody?.error || `API Error (${response.status})`);
            }
            const result = await response.json();
            if (result.recommendations) { 
                onQuizComplete(result.recommendations, finalAnswers); 
            } else { 
                throw new Error("No recommendations received."); 
            }
        } catch (e: unknown) {
            const error = e as Error;
            setError(`${t('errorGeneratingRecs')} ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [onQuizComplete, language, t]);

    
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isLoading) {
            interval = setInterval(() => { setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length); }, 2500);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isLoading]);

    const renderQuestionInput = () => {
        if (!currentQuestion) return null;
        switch (currentQuestion.type) {
            case 'text': return (<form onSubmit={(e) => { e.preventDefault(); handleAnswer(inputValue); }} className="space-y-4"><Input placeholder={currentQuestion.placeholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} /><Button type="submit">{t('next')}</Button></form>);
            case 'select': return (<select onChange={(e) => handleAnswer(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue=""><option value="" disabled>{t('selectOption')}</option>{currentQuestion.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>);
            case 'radio': return (<div className="space-y-3">{currentQuestion.options?.map(opt => (<Button key={opt} variant="outline" className="w-full justify-start text-left h-auto py-3" onClick={() => handleAnswer(opt)}>{opt}</Button>))}</div>);
            default: return null;
        }
    };
    
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="quiz">
            <Card className="max-w-2xl mx-auto"><div className="w-full bg-muted h-2 rounded-t-lg overflow-hidden"><motion.div className="bg-primary h-2" initial={{ width: 0 }} animate={{ width: `${progress}%`}} transition={{ ease: "easeInOut" }}/></div><CardHeader><CardTitle className="text-2xl">{t('careerDiscoveryQuiz')}</CardTitle><CardDescription>{t('answerQuestions')}</CardDescription></CardHeader><CardContent style={{ minHeight: '200px' }}>
                    {isLoading ? (<div className="flex flex-col items-center justify-center h-full text-center"><AnimatePresence mode="wait"><motion.div key={currentMessageIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center"><div className="relative w-12 h-12">{loadingMessages.map((msg, index) => (<AnimatePresence key={index}>{currentMessageIndex === index && (<motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="absolute inset-0 flex items-center justify-center"><msg.icon className="w-10 h-10 text-primary" /></motion.div>)}</AnimatePresence>))}</div><p className="mt-4 text-muted-foreground">{loadingMessages[currentMessageIndex].text}</p></motion.div></AnimatePresence></div>
                    ) : error ? (<div className="text-center text-destructive p-4 break-words">{error}</div>
                    ) : (<AnimatePresence mode="wait"><motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="space-y-4"><Label className="text-lg font-semibold">{currentQuestion.text}</Label>{renderQuestionInput()}</motion.div></AnimatePresence>)}</CardContent>
                <CardFooter className="text-xs text-muted-foreground">{t('questionOf', { current: currentQuestionIndex + 1, total: quizQuestions.length })}</CardFooter>
            </Card>
        </motion.div>
    );
};


const CareerPaths = ({ paths, isLoading, error, t }: { paths: CareerPath[]; isLoading: boolean; error: string; t: (key:string) => string }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="career-paths">
        {isLoading && (<div className="flex flex-col items-center justify-center h-64 text-center"><AnimatePresence mode="wait"><motion.div key="loading-career-path" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center"><Sparkles className="w-12 h-12 text-primary animate-pulse" /><p className="mt-4 text-muted-foreground">{t('buildingRoadmap')}</p></motion.div></AnimatePresence></div>)}
        {error && <div className="text-center text-destructive py-10 break-words">{error}</div>}
        {!isLoading && !error && paths.length === 0 && (<div className="text-center py-10 bg-muted/50 rounded-lg"><Map className="mx-auto h-12 w-12 text-muted-foreground" /><h3 className="mt-4 text-lg font-medium">{t('careerRoadmaps')}</h3><p className="mt-1 text-sm text-muted-foreground">{t('generatePlanHere')}</p></div>)}
        {!isLoading && !error && paths.length > 0 && (<div className="space-y-6">{paths.map((path, i) => (<Card key={i}><CardHeader><div className="flex flex-col md:flex-row md:justify-between md:items-center"><CardTitle>{path.title}</CardTitle><div className="flex items-center gap-4 mt-2 md:mt-0"><span className="text-sm font-medium text-muted-foreground">{t('avgSalary')} <strong className="text-foreground">{path.avgSalary}</strong></span><span className="text-sm font-medium text-muted-foreground">{t('timeframe')} <strong className="text-foreground">{path.timeframe}</strong></span></div></div></CardHeader><CardContent><p className="text-sm font-semibold mb-3">{t('roadmap')}</p><ol className="relative border-s border-gray-200 dark:border-gray-700">{path.steps.map((step, stepIndex) => (<li key={stepIndex} className="mb-10 ms-6"><span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"><Briefcase className="w-3 h-3 text-blue-800 dark:text-blue-300"/></span><h3 className="flex items-center mb-1 text-lg font-semibold">{step.stage}</h3><p className="block mb-2 text-sm font-normal leading-none text-gray-500">{step.description}</p><ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">{step.details.map((detail, detailIndex) => <li key={detailIndex}>{detail}</li>)}</ul></li>))}</ol></CardContent></Card>))}</div>)}
    </motion.div>
);


const FormattedAIMessage = ({ text }: { text: string }) => {
    const parseBold = (line: string) => line.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let currentListItems: string[] = [];
    lines.forEach((line) => {
        const trimmedLine = line.trim();
        const isListItem = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ');
        if (isListItem) { currentListItems.push(trimmedLine.substring(2));
        } else {
            if (currentListItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">{currentListItems.map((item, itemIndex) => <li key={itemIndex}>{parseBold(item)}</li>)}</ul>);
                currentListItems = [];
            }
            if (trimmedLine) { elements.push(<p key={`p-${elements.length}`}>{parseBold(trimmedLine)}</p>); }
        }
    });
    if (currentListItems.length > 0) { elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">{currentListItems.map((item, itemIndex) => <li key={itemIndex}>{parseBold(item)}</li>)}</ul>); }
    return <div className="space-y-2">{elements}</div>;
};

const SahayakAI = ({ profile, t, language }: { profile: any, t: (key: string) => string, language: 'en' | 'hi' }) => {
    const [messages, setMessages] = useState([{ sender: 'ai', text: `Hello ${profile.name}! I am Sahayak AI. How can I help you today?` }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (input.trim() === '') return;
        const userMessage = input;
        
        const updatedMessages = [...messages, { sender: 'user' as 'user' | 'ai', text: userMessage }];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        const conversationHistoryForAPI = updatedMessages.map(msg => ({
            role: msg.sender === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const systemPrompt = `Act as Sahayak AI, a friendly and expert career counselor for students in India. Your response must be in ${language === 'hi' ? 'Hindi' : 'English'}. The student you are talking to is ${profile.name}, who is in ${profile.class}. Their known interests include: ${profile.interests.join(', ')}. Your goal is to provide helpful, concise, and encouraging answers to their questions about career paths, entrance exams (like JEE, NEET, CUET), scholarships, and skill development. Format your responses for clarity: use **bold text** for emphasis and bullet points (using '* ' at the start of a line) for lists. Be specific to the Indian context where possible.`;
        
        const payload = { 
            contents: conversationHistoryForAPI, 
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        const apiUrl = '/api/gemini';
        try {
            const response = await fetch(apiUrl, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ payload, type: 'chat' })
            });
            if (!response.ok) { 
                const errorBody = await response.json().catch(() => ({})); 
                throw new Error(errorBody?.error || "API request failed"); 
            }
            const result = await response.json();
            if (result.response) { 
                setMessages(prev => [...prev, { sender: 'ai', text: result.response }]); 
            } else { 
                throw new Error("Couldn't get a response from the AI."); 
            }
        } catch (e) {
            console.error("Sahayak AI Error:", e);
            setMessages(prev => [...prev, { sender: 'ai', text: "I seem to be having trouble connecting. Please try again in a moment." }]);
        } finally { setIsLoading(false); }
    }, [input, messages, profile.name, profile.class, profile.interests, language]);
    
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="sahayak-ai" className="h-[calc(100vh-12rem)] sm:h-[75vh]"><Card className="h-full flex flex-col"><CardHeader><CardTitle className="text-2xl">{t('aiChatTitle')}</CardTitle><CardDescription>{t('aiChatDescription')}</CardDescription></CardHeader><CardContent className="flex-grow overflow-y-auto pr-4"><div className="space-y-4">{messages.map((msg, i) => (<div key={i} className={cn("flex items-start gap-3", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>{msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Bot className="w-5 h-5 text-primary"/></div>}<div className={cn("max-w-xs sm:max-w-md lg:max-w-lg rounded-xl p-3 text-sm", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}><FormattedAIMessage text={msg.text} /></div>{msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center"><User className="w-5 h-5 text-secondary-foreground"/></div>}</div>))}{isLoading && (<div className="flex items-start gap-3 justify-start"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Bot className="w-5 h-5 text-primary"/></div><div className="bg-muted rounded-xl p-3 text-sm"><div className="flex items-center justify-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.3s]"></span><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.15s]"></span><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse"></span></div></div></div>)}<div ref={messagesEndRef} /></div></CardContent><CardFooter className="pt-4 border-t"><form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full items-center space-x-2"><Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('askAbout')} disabled={isLoading} /><Button type="submit" disabled={isLoading}><Send className="w-4 h-4"/></Button></form></CardFooter></Card></motion.div>);
};

const ProfileModal = ({ isOpen, onClose, currentProfile, onSave, t }: { isOpen: boolean; onClose: () => void; currentProfile: any; onSave: (data: any) => void; t: (key: string) => string; }) => {
    if (!isOpen) return null;
    const [profileData, setProfileData] = useState({ name: currentProfile.name, grade: currentProfile.class, location: currentProfile.location, interests: currentProfile.interests.join(', '), strengths: currentProfile.strengths.join(', '), });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { id, value } = e.target; setProfileData(prev => ({...prev, [id]: value})); };
    const handleSave = () => { onSave(profileData); };
    return (<AnimatePresence>{isOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}><motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-lg" onClick={e => e.stopPropagation()}><Card><CardHeader><CardTitle className="text-2xl">{t('completeProfileTitle')}</CardTitle><CardDescription>{t('completeProfileDescription')}</CardDescription></CardHeader><CardContent className="space-y-4 max-h-[70vh] overflow-y-auto pr-4"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="name">{t('fullName')}</Label><Input id="name" value={profileData.name} onChange={handleInputChange} /></div><div className="space-y-2"><Label htmlFor="grade">{t('gradeClass')}</Label><Input id="grade" value={profileData.grade} onChange={handleInputChange} /></div></div><div className="space-y-2"><Label htmlFor="location">{t('location')}</Label><Input id="location" value={profileData.location} onChange={handleInputChange} placeholder="e.g., Mumbai, Maharashtra"/></div><div className="space-y-2"><Label htmlFor="interests">{t('interestsComma')}</Label><Input id="interests" value={profileData.interests} onChange={handleInputChange} placeholder="e.g., AI, Web Dev, Robotics" /></div><div className="space-y-2"><Label htmlFor="strengths">{t('strengthsComma')}</Label><Input id="strengths" value={profileData.strengths} onChange={handleInputChange} placeholder="e.g., Problem Solving, Math" /></div></CardContent><CardFooter className="justify-end space-x-2"><Button variant="ghost" onClick={onClose}>{t('cancel')}</Button><Button onClick={handleSave}>{t('saveProfile')}</Button></CardFooter></Card></motion.div></motion.div>)}</AnimatePresence>);
};

const BottomNavBar = ({ activeTab, setActiveTab, t }: { activeTab: Tab; setActiveTab: (tab: Tab) => void; t: (key: keyof typeof translations.en) => string; }) => (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-50 p-2">
      <div className="flex justify-around items-center">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex flex-col items-center justify-center w-16 h-16 transition-colors rounded-lg",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <div className="relative">
              <tab.icon className="w-6 h-6" />
              {activeTab === tab.id && (
                <motion.div
                  layoutId="bottom-nav-active-dot"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </div>
            <span className="text-xs mt-1">{t(tab.mobileLabelKey || tab.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
);

const SahayakAdvisor = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState(initialStudentProfile);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [generatedCareerPaths, setGeneratedCareerPaths] = useState<CareerPath[]>([]);
  const [isCareerPathLoading, setIsCareerPathLoading] = useState(false);
  const [careerPathError, setCareerPathError] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { currentUser, logout } = useAuth();

  const t = useCallback((key: keyof typeof translations.en, options: Record<string, string | number> = {}) => {
    let text: string = translations[language][key as keyof typeof translations.hi] as string || translations.en[key] as string;
    Object.keys(options).forEach(k => {
        text = text.replace(`{${k}}`, String(options[k]));
    });
    return text;
  }, [language]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => { setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light')); }, []);
  const toggleLanguage = useCallback(() => { setLanguage(prevLang => (prevLang === 'en' ? 'hi' : 'en')); }, []);
  
  const handleProfileSave = useCallback((newProfileData: any) => {
      setStudentProfile(prevProfile => ({ ...prevProfile, name: newProfileData.name, class: newProfileData.grade, location: newProfileData.location, interests: newProfileData.interests.split(',').map((s: string) => s.trim()).filter(Boolean), strengths: newProfileData.strengths.split(',').map((s: string) => s.trim()).filter(Boolean), profileCompletion: 100, }));
      setIsProfileModalOpen(false);
  }, []);

  // Update student profile with Firebase user data
  useEffect(() => {
    if (currentUser) {
      setStudentProfile(prevProfile => ({
        ...prevProfile,
        name: currentUser.displayName || prevProfile.name,
        // You can add more Firebase user data here
      }));
    }
  }, [currentUser]);
  
  const handleQuizComplete = useCallback((generatedRecommendations: Recommendation[], studentData: any) => {
      setRecommendations(generatedRecommendations);
      setStudentProfile(prev => ({...prev, name: studentData.name || prev.name, class: studentData.grade || prev.class, interests: (studentData.freeTime || '').split(',').map((s:string) => s.trim()).filter(Boolean), strengths: (studentData.favoriteSubject || '').split(',').map((s:string) => s.trim()).filter(Boolean), aptitudeScore: Math.floor(Math.random() * (95 - 80 + 1)) + 80, profileCompletion: 75, }));
      setActiveTab('Recommendations');
  }, []);

  const handleExplorePath = useCallback(async (recommendationTitle: string) => {
    setIsCareerPathLoading(true);
    setCareerPathError('');
    setActiveTab('Career Paths');

    const systemPrompt = `Act as an expert career counselor in India. A student is exploring the career path for "${recommendationTitle}". Generate a detailed, step-by-step career path roadmap. Respond in the language: ${language === 'hi' ? 'Hindi' : 'English'}. The roadmap should be structured as a JSON object with a title, avgSalary, timeframe, and an array of steps. Each step must have a 'stage' (e.g., 'Foundation (11th-12th)', 'Higher Education', 'Skill Development', 'Experience Building', 'Job Market'), a 'description' of that stage, and an array of 'details' (bullet points). Provide practical, India-specific advice.`;
    
    const userQuery = `Generate the career path for: ${recommendationTitle}`;

    const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json",
            responseSchema: { type: "OBJECT", properties: { "title": { "type": "STRING" }, "avgSalary": { "type": "STRING" }, "timeframe": { "type": "STRING" }, "steps": { type: "ARRAY", items: { type: "OBJECT", properties: { "stage": { "type": "STRING" }, "description": { "type": "STRING" }, "details": { "type": "ARRAY", "items": { "type": "STRING" } } }, required: ["stage", "description", "details"]}}}, required: ["title", "avgSalary", "timeframe", "steps"]}
        }
    };

    const apiUrl = '/api/gemini';

    try {
        const response = await fetch(apiUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ payload, type: 'career-path' })
        });
        if (!response.ok) { 
            const errorBody = await response.json().catch(() => ({})); 
            throw new Error(errorBody?.error || `API Error (${response.status})`); 
        }
        const result = await response.json();
        if (result.careerPath) { 
            setGeneratedCareerPaths(prevPaths => [result.careerPath, ...prevPaths.filter(p => p.title !== result.careerPath.title)]);
        } else { 
            throw new Error("No career path received from the model."); 
        }
    } catch (e: unknown) {
        const error = e as Error;
        console.error("Gemini API call for career path failed:", error);
        setCareerPathError(`${t('errorGeneratingPath')} ${error.message}`);
    } finally {
        setIsCareerPathLoading(false);
    }
  }, [language, t]);
  
  return (
    <>
      <div className="bg-background text-foreground min-h-screen">
         <header className="sticky top-0 z-40 bg-background/80 dark:bg-background/60 backdrop-blur-lg border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                      <div className="flex items-center gap-3">
                           <GraduationCap className="w-8 h-8 text-primary"/>
                           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Sahayak</h1>
                      </div>
                      
                      <div className="hidden lg:flex flex-grow justify-center">
                         <div className="bg-muted p-1 flex rounded-full">
                            {TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors flex-shrink-0 rounded-full", activeTab !== tab.id && "hover:bg-background/60 text-muted-foreground")}>{activeTab === tab.id && (<motion.div layoutId="active-pill" className="absolute inset-0 bg-background shadow-md" style={{ borderRadius: 9999 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}/>)}<span className={cn("relative z-10 transition-colors", activeTab === tab.id ? "text-primary" : "")}><tab.icon className="h-5 w-5"/></span><span className={cn("relative z-10 transition-colors", activeTab === tab.id ? "text-primary font-semibold" : "")}>{t(tab.labelKey as any)}</span></button>))}
                         </div>
                      </div>

                      <div className="flex items-center gap-2">
                            <Button onClick={toggleLanguage} variant="ghost" size="icon" className="h-10 w-10 text-sm font-semibold">{language === 'en' ? 'HI' : 'EN'}</Button>
                            <Button onClick={toggleTheme} variant="ghost" size="icon" className="h-10 w-10"><Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /><Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /></Button>
                          <div className="relative">
                              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setIsProfileModalOpen(true)}><User className="h-5 w-5" />{studentProfile.profileCompletion < 100 && (<span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span></span>)}</Button>
                          </div>
                          <Button onClick={logout} variant="outline" size="sm" className="h-10 px-4">
                            Logout
                          </Button>
                      </div>
                  </div>
                   <div className="mt-4 hidden md:flex lg:hidden justify-center bg-muted rounded-full p-1 overflow-x-auto">
                       {TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors flex-shrink-0 rounded-full", activeTab !== tab.id && "hover:bg-background/60 text-muted-foreground")}>{activeTab === tab.id && (<motion.div layoutId="active-pill-tablet" className="absolute inset-0 bg-background shadow-md" style={{ borderRadius: 9999 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}/>)}<span className={cn("relative z-10 transition-colors", activeTab === tab.id ? "text-primary" : "")}><tab.icon className="h-5 w-5"/></span><span className={cn("relative z-10 transition-colors", activeTab === tab.id ? "text-primary font-semibold" : "")}>{t(tab.labelKey as any)}</span></button>))}
                   </div>
              </div>
         </header>
         <main className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 pb-24 sm:pb-8 mt-6">
              <AnimatePresence mode="wait">
                {activeTab === 'Dashboard' && <Dashboard profile={studentProfile} onTakeQuiz={() => setActiveTab('Quiz')} t={t as any}/>}
                {activeTab === 'Recommendations' && <Recommendations recommendations={recommendations} onExplorePath={handleExplorePath} t={t as any}/>}
                {activeTab === 'Quiz' && <Quiz onQuizComplete={handleQuizComplete} t={t as any} language={language}/>}
                {activeTab === 'Career Paths' && <CareerPaths paths={generatedCareerPaths} isLoading={isCareerPathLoading} error={careerPathError} t={t as any}/>}
                {activeTab === 'Sahayak AI' && <SahayakAI profile={studentProfile} t={t as any} language={language}/>}
              </AnimatePresence>
         </main>
         <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} t={t as any} />
        </div>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} currentProfile={studentProfile} onSave={handleProfileSave} t={t as any}/>
    </>
  );
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<SahayakLandingPage />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/app" element={
                        <ProtectedRoute>
                            <SahayakAdvisor />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

