

// SYSTEM ROLES
export const SYSTEM_ROLE = {
  JOB_SEEKER: 'JOB_SEEKER',
  ADMIN: 'ADMIN',
}

// JOB EMPLOYMENT TYPES
export const JOB_EMPLOYMENT_TYPES = {
  FULL_TIME: "Full-Time",
  PART_TIME: "Part-Time",
  REMOTE: "Remote",
  INTERNSHIP: "Internship",
  CONTRACT: "Contract"
};
// Create an array of the values for the Mongoose enum validator
export const jobEmploymentTypeValues = Object.values(JOB_EMPLOYMENT_TYPES);


// JOB CATEGORIES
export const JOB_CATEGORY = {
  DESIGN: "Design",
  SALES: "Sales",
  MARKETING: "Marketing",
  BUSINESS: "Business",
  HUMAN_RESOURCE: "Human Resource",
  ENGINEERING: "Engineering",
  TECHNOLOGY: "Technology"
}
export const jobCategoryValues = Object.values(JOB_CATEGORY);

// JOB BENEFITS
export const JOB_BENEFITS = {
  HEALTH_CARE: {
    id: 1,
    icon: "/public/images/Perks/PerksHealth.png",
    title: "Full Healthcare",
    description:
      "We believe in thriving communities and that starts with our team being happy and healthy.",
  },
  VACATION: {
    id: 2,
    icon: "/public/images/Perks/PerksVacation.png",
    title: "Unlimited Vacation",
    description:
      "We believe you should have a flexible schedule that makes space for family, wellness, and fun.",
  },
  SKILL_DEVELOPMENT: {
    id: 3,
    icon: "/public/images/Perks/PerksSkills.png",
    title: "Skill Development",
    description:
      "We believe in always learning and leveling up our skills. Whether it's a conference or online course.",
  },
  REMOTE_WORKING: {
    id: 4,
    icon: "/public/images/Perks/PerksRemote.png",
    title: "Remote Working",
    description:
      "You know how you perform your best. Work from home, coffee shop or anywhere when you feel like it.",
  },
  TEAM_SUMMITS: {
    id: 5,
    icon: "/public/images/Perks/PerksTeamSummits.png",
    title: "Team Summits",
    description:
      "Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter.",
  },
  COMMUTER: {
    id: 6,
    icon: "/public/images/Perks/PerksCommuter.png",
    title: "Commuter Benefits",
    description:
      "We’re grateful for all the time and energy each team member puts into getting to work every day.",
  },
  GIVING_BACK: {
    id: 7,
    icon: "/public/images/Perks/PerksGive.png",
    title: "We give back.",
    description:
      "We anonymously match any donation our employees make (up to $/€ 600) so they can support the organizations they care about most—times two.",
  }
}

// JOB QUESTION TYPES
export const QUESTION_TYPE = {
  TEXT: "TEXT",
  YES_NO: "YES_NO"
};

export const ANSWER_TYPE = {
  TEXT: "TEXT",
  YES_NO: "YES_NO"
};

// SKILL LEVEL 
export const SKILL_LEVEL = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
  EXPERT: "EXPERT",
};


// APPLICATION STATUS
export const APPLICATION_STATUS = {
  IN_REVIEW: "IN_REVIEW",
  INTERVIEWING: "INTERVIEWING",
  OFFERED: "OFFERED",
  HIRED: "HIRED",
  UNSUITABLE: "UNSUITABLE",
  DECLINED: "DECLINED",
};

// EMPLOYMENT LEVEL (Optional Enum)
export const EMPLOYMENT_LEVEL = {
  INTERN: "INTERN",
  ENTRY: "ENTRY",
  MID: "MID",
  SENIOR: "SENIOR",
  LEAD: "LEAD",
  MANAGER: "MANAGER",
};


// COMPANY LINK TYPES (Optional Enum)
export const COMPANY_LINK_TYPE = {
  WEBSITE: "WEBSITE",
  LINKEDIN: "LINKEDIN",
  FACEBOOK: "FACEBOOK",
  TWITTER: "TWITTER",
  INSTAGRAM: "INSTAGRAM",
};

export const LANGUAGE_LEVELS = {
  BASIC: " BASIC",
  INTERMEDIATE: "INTERMEDIATE",
  FLUENT: "FLUENT",
  NATIVE: "NATIVE",
};

export const COMPANY_INDUSTRIES = {
  TECHNOLOGY: {
    id: 1,
    name: "Technology",
    icon: "/public/images/industries/technology.png",
  },
  FINANCE: {
    id: 2,
    name: "Finance",
    icon: "/public/images/industries/finance.png",
  },
  HEALTHCARE: {
    id: 3,
    name: "Healthcare",
    icon: "/public/images/industries/healthcare.png",
  },
  EDUCATION: {
    id: 4,
    name: "Education",
    icon: "/public/images/industries/education.png",
  },
  MARKETING: {
    id: 5,
    name: "Marketing",
    icon: "/public/images/industries/marketing.png",
  },
  NON_PROFIT: {
    id: 6,
    name: "Social & Non-Profit",
    icon: "/public/images/industries/nonprofit.png",
  },
};

export const TECH_STACK = {
  /* ===== FRONTEND ===== */
  HTML: {
    id: 1,
    name: "HTML5",
    icon: "/public/images/tech/html.png",
    category: "Frontend",
  },
  CSS: {
    id: 2,
    name: "CSS3",
    icon: "/public/images/tech/css.png",
    category: "Frontend",
  },
  JAVASCRIPT: {
    id: 3,
    name: "JavaScript",
    icon: "/public/images/tech/javascript.png",
    category: "Frontend",
  },
  TYPESCRIPT: {
    id: 4,
    name: "TypeScript",
    icon: "/public/images/tech/typescript.png",
    category: "Frontend",
  },
  REACT: {
    id: 5,
    name: "React",
    icon: "/public/images/tech/react.png",
    category: "Frontend",
  },
  NEXTJS: {
    id: 6,
    name: "Next.js",
    icon: "/public/images/tech/nextjs.png",
    category: "Frontend",
  },
  VUE: {
    id: 7,
    name: "Vue.js",
    icon: "/public/images/tech/vue.png",
    category: "Frontend",
  },

  /* ===== BACKEND ===== */
  NODEJS: {
    id: 8,
    name: "Node.js",
    icon: "/public/images/tech/node.png",
    category: "Backend",
  },
  EXPRESS: {
    id: 9,
    name: "Express.js",
    icon: "/public/images/tech/express.png",
    category: "Backend",
  },
  NESTJS: {
    id: 10,
    name: "NestJS",
    icon: "/public/images/tech/nestjs.png",
    category: "Backend",
  },
  DJANGO: {
    id: 11,
    name: "Django",
    icon: "/public/images/tech/django.png",
    category: "Backend",
  },
  RUBY: {
    id: 12,
    name: "Ruby",
    icon: "/public/images/tech/ruby.png",
    category: "Backend",
  },

  /* ===== DATABASE ===== */
  MONGODB: {
    id: 13,
    name: "MongoDB",
    icon: "/public/images/tech/mongodb.png",
    category: "Database",
  },
  POSTGRES: {
    id: 14,
    name: "PostgreSQL",
    icon: "/public/images/tech/postgres.png",
    category: "Database",
  },
  MYSQL: {
    id: 15,
    name: "MySQL",
    icon: "/public/images/tech/mysql.png",
    category: "Database",
  },
  REDIS: {
    id: 16,
    name: "Redis",
    icon: "/public/images/tech/redis.png",
    category: "Database",
  },

  /* ===== DEVOPS / CLOUD ===== */
  DOCKER: {
    id: 17,
    name: "Docker",
    icon: "/public/images/tech/docker.png",
    category: "DevOps",
  },
  KUBERNETES: {
    id: 18,
    name: "Kubernetes",
    icon: "/public/images/tech/kubernetes.png",
    category: "DevOps",
  },
  AWS: {
    id: 19,
    name: "AWS",
    icon: "/public/images/tech/aws.png",
    category: "Cloud",
  },
  GCP: {
    id: 20,
    name: "Google Cloud",
    icon: "/public/images/tech/gcp.png",
    category: "Cloud",
  },

  /* ===== ANALYTICS / TOOLS ===== */
  MIXPANEL: {
    id: 21,
    name: "Mixpanel",
    icon: "/public/images/tech/mixpanel.png",
    category: "Analytics",
  },
  GOOGLE_ANALYTICS: {
    id: 22,
    name: "Google Analytics",
    icon: "/public/images/tech/ga.png",
    category: "Analytics",
  },
  FRAMER: {
    id: 23,
    name: "Framer",
    icon: "/public/images/tech/framer.png",
    category: "Design",
  },
  FIGMA: {
    id: 24,
    name: "Figma",
    icon: "/public/images/tech/figma.png",
    category: "Design",
  },
};


export const OFFICE_LOCATIONS = {
  USA_NY: {
    id: 1,
    country: "United States",
    city: "New York",
    flag: "🇺🇸",
    isHeadQuarter: true,
  },
  USA_SF: {
    id: 2,
    country: "United States",
    city: "San Francisco",
    flag: "🇺🇸",
  },
  UK_LONDON: {
    id: 3,
    country: "United Kingdom",
    city: "London",
    flag: "🇬🇧",
  },
  GERMANY_BERLIN: {
    id: 4,
    country: "Germany",
    city: "Berlin",
    flag: "🇩🇪",
  },
  JAPAN_TOKYO: {
    id: 5,
    country: "Japan",
    city: "Tokyo",
    flag: "🇯🇵",
  },
  CANADA_TORONTO: {
    id: 6,
    country: "Canada",
    city: "Toronto",
    flag: "🇨🇦",
  },
  AUSTRALIA_SYDNEY: {
    id: 7,
    country: "Australia",
    city: "Sydney",
    flag: "🇦🇺",
  },
  UAE_DUBAI: {
    id: 8,
    country: "UAE",
    city: "Dubai",
    flag: "🇦🇪",
  },
  EGYPT_CAIRO: {
    id: 9,
    country: "Egypt",
    city: "Cairo",
    flag: "🇪🇬",
  },
  REMOTE: {
    id: 10,
    country: "Remote",
    city: "Worldwide",
    flag: "🌍",
    isRemote: true,
  },
};



// for multer
export const ImageExtensions = ['image/jpg', 'image/jpeg', 'image/png']
export const VideoExtensions = [' video/mp4', 'video/avi', 'Video/mov']
export const PDFExtension = ['application/pdf']
