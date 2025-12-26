

// SYSTEM ROLES
export const SYSTEM_ROLE = {
  JOB_SEEKER: 'JOB_SEEKER',
  ADMIN: 'ADMIN',
  COMPANY: 'COMPANY',
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
  TECHNOLOGY: "Technology",
 
  FINANCE: "Finance",
  HEALTHCARE: "Healthcare",

  EDUCATION:  "Education",

  MARKETING: "Marketing" ,
  NON_PROFIT: "Social & Non-Profit"
}

export const TECH_STACK = {
  /* ===== FRONTEND ===== */
  HTML: "/public/images/tech/html.png",
  CSS: "/public/images/tech/css.png",
  JAVASCRIPT: "/public/images/tech/javascript.png",
  TYPESCRIPT: "/public/images/tech/typescript.png",
  REACT: "/public/images/tech/react.png",
  NEXTJS: "/public/images/tech/nextjs.png",
  VUE: "/public/images/tech/vue.png",

  /* ===== BACKEND ===== */
  NODEJS: "/public/images/tech/node.png",
  EXPRESS: "/public/images/tech/express.png",
  NESTJS: "/public/images/tech/nestjs.png",
  DJANGO: "/public/images/tech/django.png",
  RUBY: "/public/images/tech/ruby.png",

  /* ===== DATABASE ===== */
  MONGODB: "/public/images/tech/mongodb.png",
  POSTGRES: "/public/images/tech/postgres.png",
  MYSQL: "/public/images/tech/mysql.png",
  REDIS: "/public/images/tech/redis.png",

  /* ===== DEVOPS / CLOUD ===== */
  DOCKER: "/public/images/tech/docker.png",
  KUBERNETES: "/public/images/tech/kubernetes.png",
  AWS: "/public/images/tech/aws.png",
  GCP: "/public/images/tech/gcp.png",

  /* ===== ANALYTICS / DESIGN ===== */
  MIXPANEL: "/public/images/tech/mixpanel.png",
  GOOGLE_ANALYTICS: "/public/images/tech/ga.png",
  FRAMER: "/public/images/tech/framer.png",
  FIGMA: "/public/images/tech/figma.png",
};


// for multer
export const ImageExtensions = ['image/jpg', 'image/jpeg', 'image/png']
export const VideoExtensions = [' video/mp4', 'video/avi', 'Video/mov']
export const PDFExtension = ['application/pdf']
