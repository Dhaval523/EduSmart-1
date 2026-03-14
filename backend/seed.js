import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./src/config/db.js";
import { User } from "./src/models/user.model.js";
import { Course } from "./src/models/course.model.js";
import { Modules } from "./src/models/module.model.js";
import { Comment } from "./src/models/comment.model.js";
import { Enrollment } from "./src/models/enrollment.model.js";
import { Order } from "./src/models/order.model.js";
import { Progress } from "./src/models/progress.model.js";

const placeholderThumbs = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"
];

const usersSeed = [
  { fullName: "Aarav Kapoor", email: "aarav@edusmart.dev", password: "Password@123", admin: true },
  { fullName: "Meera Iyer", email: "meera@edusmart.dev", password: "Password@123", admin: false },
  { fullName: "Rohan Singh", email: "rohan@edusmart.dev", password: "Password@123", admin: false },
  { fullName: "Sara Khan", email: "sara@edusmart.dev", password: "Password@123", admin: false }
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const videoLibrary = {
  htmlCss: "https://www.youtube.com/watch?v=a_iQb1lnAEQ",
  javascript: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
  react: "https://www.youtube.com/watch?v=x4rFhThSX04",
  reactAlt: "https://www.youtube.com/watch?v=bMknfKXIFA8",
  reactTs: "https://www.youtube.com/watch?v=FJDVKeh7RJI",
  nodeExpress: "https://www.youtube.com/watch?v=Oe421EPjeBE",
  mern: "https://www.youtube.com/watch?v=O3BUHwfHf84",
  python: "https://www.youtube.com/watch?v=rfscVS0vtbw",
  pythonAlt: "https://www.youtube.com/watch?v=8DvywoWv6fI",
  sql: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
  sqlAnalytics: "https://www.youtube.com/watch?v=mXW7JHJM34k",
  excel: "https://www.youtube.com/watch?v=Vl0H-qTclOg",
  excelFormulas: "https://www.youtube.com/watch?v=Y8xhrUa3KH4",
  pythonExcel: "https://www.youtube.com/watch?v=qEwnlMBaLfc",
  figma: "https://www.youtube.com/watch?v=jwCmIBJ8Jtc",
  figmaUiUx: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
  designSystem: "https://www.youtube.com/watch?v=RYDiDpW2VkM",
  dataAnalyst: "https://www.youtube.com/watch?v=PSNXoAs2FtQ",
  machineLearning: "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
  pandas: "https://www.youtube.com/watch?v=r-uOLxNrNk8",
  docker: "https://www.youtube.com/watch?v=9zUHg7xjIqQ",
  reactNative: "https://www.youtube.com/watch?v=sm5Y7Vtuihg",
  dsaPython: "https://www.youtube.com/watch?v=pkYVOmU3MgA",
  oopPython: "https://www.youtube.com/watch?v=Ej_02ICOIgs"
};

const resourceLibrary = {
  react: [{ type: "link", title: "React Docs", url: "https://react.dev/learn" }],
  node: [{ type: "link", title: "Node.js Docs", url: "https://nodejs.org/en/docs" }],
  express: [{ type: "link", title: "Express Docs", url: "https://expressjs.com/" }],
  mongodb: [{ type: "link", title: "MongoDB Docs", url: "https://www.mongodb.com/docs/" }],
  python: [{ type: "link", title: "Python Docs", url: "https://docs.python.org/3/" }],
  pandas: [{ type: "link", title: "pandas Docs", url: "https://pandas.pydata.org/docs/" }],
  sklearn: [{ type: "link", title: "scikit-learn Docs", url: "https://scikit-learn.org/stable/user_guide.html" }],
  sql: [{ type: "link", title: "SQL Tutorial", url: "https://www.w3schools.com/sql/" }],
  figma: [{ type: "link", title: "Figma Learn", url: "https://help.figma.com/hc/en-us" }],
  excel: [{ type: "link", title: "Microsoft Excel Help", url: "https://support.microsoft.com/excel" }],
  docker: [{ type: "link", title: "Docker Docs", url: "https://docs.docker.com/" }]
};

const makeModules = (tracks) =>
  tracks.map((track, index) => ({
    title: track.title,
    description: track.description,
    video: track.video,
    order: index + 1,
    duration: track.duration,
    isPreviewFree: index === 0,
    resources: track.resources || []
  }));

const courseBlueprints = [
  // Web Development (10)
  {
    title: "HTML & CSS Foundations",
    description: "Learn semantic HTML, modern CSS, layouts, and responsive design from scratch.",
    category: "Development",
    subcategory: "Frontend",
    level: "Beginner",
    duration: "4 weeks",
    amount: 799,
    instructor: "Aarav Kapoor",
    tags: ["html", "css", "responsive", "frontend"],
    overview: "A beginner-friendly course focused on building polished web pages using modern HTML and CSS techniques.",
    requirements: ["Basic computer skills", "A code editor", "Curiosity to build websites"],
    learningOutcomes: [
      "Build structured HTML pages",
      "Create responsive layouts with CSS",
      "Use Flexbox and Grid effectively",
      "Ship simple landing pages confidently"
    ],
    modules: makeModules([
      {
        title: "HTML Essentials",
        description: "Learn document structure, semantic tags, links, forms, and accessibility basics.",
        video: videoLibrary.htmlCss,
        duration: "45 min",
        resources: []
      },
      {
        title: "CSS Fundamentals",
        description: "Master selectors, spacing, typography, colors, and component styling.",
        video: videoLibrary.htmlCss,
        duration: "52 min",
        resources: []
      },
      {
        title: "Responsive Layouts",
        description: "Use Flexbox, Grid, and media queries for multi-device layouts.",
        video: videoLibrary.htmlCss,
        duration: "48 min",
        resources: []
      },
      {
        title: "Mini Project Build",
        description: "Build and polish a complete multi-section landing page.",
        video: videoLibrary.htmlCss,
        duration: "55 min",
        resources: []
      }
    ])
  },
  {
    title: "JavaScript Essentials",
    description: "Understand variables, functions, arrays, objects, DOM manipulation, and modern JS basics.",
    category: "Development",
    subcategory: "Frontend",
    level: "Beginner",
    duration: "5 weeks",
    amount: 899,
    instructor: "Aarav Kapoor",
    tags: ["javascript", "dom", "web"],
    overview: "A practical JavaScript course for absolute beginners who want to build real interactive websites.",
    requirements: ["Basic HTML/CSS knowledge"],
    learningOutcomes: [
      "Write core JavaScript confidently",
      "Manipulate the DOM",
      "Build interactive UI behavior",
      "Understand arrays, objects, and functions"
    ],
    modules: makeModules([
      {
        title: "JavaScript Syntax Basics",
        description: "Variables, data types, operators, functions, and control flow.",
        video: videoLibrary.javascript,
        duration: "50 min",
        resources: []
      },
      {
        title: "Arrays and Objects",
        description: "Use built-in methods and structure app data effectively.",
        video: videoLibrary.javascript,
        duration: "45 min",
        resources: []
      },
      {
        title: "DOM Manipulation",
        description: "Select elements, update content, handle events, and build dynamic pages.",
        video: videoLibrary.javascript,
        duration: "55 min",
        resources: []
      },
      {
        title: "Project: Interactive App",
        description: "Create a browser-based app with real event-driven logic.",
        video: videoLibrary.javascript,
        duration: "60 min",
        resources: []
      }
    ])
  },
  {
    title: "React for Beginners",
    description: "Build interactive user interfaces with components, props, hooks, and modern React patterns.",
    category: "Development",
    subcategory: "Frontend",
    level: "Beginner",
    duration: "6 weeks",
    amount: 1199,
    instructor: "Aarav Kapoor",
    tags: ["react", "frontend", "hooks"],
    overview: "A project-based introduction to React for building reusable and scalable UI components.",
    requirements: ["Basic JavaScript knowledge", "Comfort with HTML/CSS"],
    learningOutcomes: [
      "Build apps with components and props",
      "Use state and effects",
      "Manage events and forms",
      "Structure small React projects"
    ],
    modules: makeModules([
      {
        title: "React Setup and JSX",
        description: "Understand React architecture, setup, JSX, and component basics.",
        video: videoLibrary.react,
        duration: "48 min",
        resources: resourceLibrary.react
      },
      {
        title: "Props, State, and Events",
        description: "Learn component communication and local state management.",
        video: videoLibrary.reactAlt,
        duration: "52 min",
        resources: resourceLibrary.react
      },
      {
        title: "Hooks and Effects",
        description: "Use useState and useEffect to handle reactive UI behavior.",
        video: videoLibrary.react,
        duration: "55 min",
        resources: resourceLibrary.react
      },
      {
        title: "Project: Task Dashboard",
        description: "Build a small task or note app with reusable components.",
        video: videoLibrary.reactAlt,
        duration: "65 min",
        resources: resourceLibrary.react
      }
    ])
  },
  {
    title: "Advanced React Patterns",
    description: "Level up with composition, custom hooks, performance patterns, and scalable UI architecture.",
    category: "Development",
    subcategory: "Frontend",
    level: "Intermediate",
    duration: "5 weeks",
    amount: 1399,
    instructor: "Aarav Kapoor",
    tags: ["react", "hooks", "patterns", "architecture"],
    overview: "An intermediate course for developers who already know React basics and want stronger production patterns.",
    requirements: ["React basics", "JavaScript ES6+"],
    learningOutcomes: [
      "Build custom hooks",
      "Refactor for reusability",
      "Improve rendering performance",
      "Organize medium-sized React apps"
    ],
    modules: makeModules([
      {
        title: "Composition and Reusability",
        description: "Use component composition instead of duplication-heavy patterns.",
        video: videoLibrary.reactAlt,
        duration: "45 min",
        resources: resourceLibrary.react
      },
      {
        title: "Custom Hooks",
        description: "Extract shared logic and make components cleaner.",
        video: videoLibrary.react,
        duration: "50 min",
        resources: resourceLibrary.react
      },
      {
        title: "Performance Patterns",
        description: "Explore memoization, rendering behavior, and optimization basics.",
        video: videoLibrary.reactAlt,
        duration: "52 min",
        resources: resourceLibrary.react
      },
      {
        title: "Scalable Project Structure",
        description: "Organize folders, state, and business logic for production codebases.",
        video: videoLibrary.react,
        duration: "60 min",
        resources: resourceLibrary.react
      }
    ])
  },
  {
    title: "React with TypeScript",
    description: "Build safer frontend apps by combining React with TypeScript fundamentals.",
    category: "Development",
    subcategory: "Frontend",
    level: "Intermediate",
    duration: "4 weeks",
    amount: 1299,
    instructor: "Aarav Kapoor",
    tags: ["react", "typescript", "frontend"],
    overview: "Add strong typing to React apps and improve code safety, maintainability, and team collaboration.",
    requirements: ["React basics", "Basic TypeScript interest"],
    learningOutcomes: [
      "Understand TS basics in React",
      "Type props and state correctly",
      "Handle forms and events safely",
      "Build more maintainable components"
    ],
    modules: makeModules([
      {
        title: "TypeScript Foundations",
        description: "Understand types, interfaces, unions, and type inference.",
        video: videoLibrary.reactTs,
        duration: "42 min",
        resources: resourceLibrary.react
      },
      {
        title: "Typing React Components",
        description: "Type props, children, and component return values.",
        video: videoLibrary.reactTs,
        duration: "46 min",
        resources: resourceLibrary.react
      },
      {
        title: "Forms and Events",
        description: "Handle form state and events with correct typing.",
        video: videoLibrary.reactTs,
        duration: "44 min",
        resources: resourceLibrary.react
      },
      {
        title: "Mini App in React + TS",
        description: "Build a small app while applying practical typing patterns.",
        video: videoLibrary.reactTs,
        duration: "58 min",
        resources: resourceLibrary.react
      }
    ])
  },
  {
    title: "Node.js Backend Basics",
    description: "Create backend services with Node.js, modules, npm, and server-side JavaScript fundamentals.",
    category: "Development",
    subcategory: "Backend",
    level: "Beginner",
    duration: "4 weeks",
    amount: 999,
    instructor: "Aarav Kapoor",
    tags: ["node", "backend", "javascript"],
    overview: "A beginner-friendly backend course that introduces core server-side JavaScript concepts.",
    requirements: ["Basic JavaScript knowledge"],
    learningOutcomes: [
      "Run Node.js applications",
      "Understand npm and packages",
      "Work with files and modules",
      "Build simple backend utilities"
    ],
    modules: makeModules([
      {
        title: "Node Runtime Basics",
        description: "Learn how Node works and why server-side JS matters.",
        video: videoLibrary.nodeExpress,
        duration: "40 min",
        resources: resourceLibrary.node
      },
      {
        title: "Modules and npm",
        description: "Use local modules, external packages, and scripts.",
        video: videoLibrary.nodeExpress,
        duration: "42 min",
        resources: resourceLibrary.node
      },
      {
        title: "Async Patterns",
        description: "Understand callbacks, promises, and async/await in Node.",
        video: videoLibrary.nodeExpress,
        duration: "48 min",
        resources: resourceLibrary.node
      },
      {
        title: "Mini Backend Utility",
        description: "Build a simple backend tool or CLI utility with Node.",
        video: videoLibrary.nodeExpress,
        duration: "55 min",
        resources: resourceLibrary.node
      }
    ])
  },
  {
    title: "Express APIs from Scratch",
    description: "Build REST APIs with Express, middleware, routing, validation, and controller structure.",
    category: "Development",
    subcategory: "Backend",
    level: "Beginner",
    duration: "5 weeks",
    amount: 1099,
    instructor: "Aarav Kapoor",
    tags: ["express", "api", "backend", "rest"],
    overview: "Learn to build clean and practical server APIs with Express and modern backend conventions.",
    requirements: ["Basic JavaScript", "Node basics helpful"],
    learningOutcomes: [
      "Create Express servers",
      "Build REST endpoints",
      "Use middleware",
      "Structure controllers and routes"
    ],
    modules: makeModules([
      {
        title: "Express Fundamentals",
        description: "Set up Express, define routes, and send API responses.",
        video: videoLibrary.nodeExpress,
        duration: "45 min",
        resources: resourceLibrary.express
      },
      {
        title: "Middleware and Validation",
        description: "Use middleware for auth, logging, and request validation.",
        video: videoLibrary.nodeExpress,
        duration: "48 min",
        resources: resourceLibrary.express
      },
      {
        title: "Controller Architecture",
        description: "Organize backend code into scalable route-controller-service layers.",
        video: videoLibrary.nodeExpress,
        duration: "50 min",
        resources: resourceLibrary.express
      },
      {
        title: "Project: REST API",
        description: "Build a practical Express CRUD API from scratch.",
        video: videoLibrary.nodeExpress,
        duration: "62 min",
        resources: resourceLibrary.express
      }
    ])
  },
  {
    title: "MongoDB for MERN Developers",
    description: "Understand schema design, CRUD operations, indexing, and MongoDB integration for full-stack apps.",
    category: "Development",
    subcategory: "Database",
    level: "Intermediate",
    duration: "4 weeks",
    amount: 999,
    instructor: "Aarav Kapoor",
    tags: ["mongodb", "database", "mern"],
    overview: "A practical guide to modeling data and integrating MongoDB into modern JavaScript projects.",
    requirements: ["Basic backend understanding"],
    learningOutcomes: [
      "Design basic collections and schemas",
      "Perform CRUD operations",
      "Use indexing concepts",
      "Integrate MongoDB with Express apps"
    ],
    modules: makeModules([
      {
        title: "MongoDB Basics",
        description: "Understand documents, collections, and CRUD fundamentals.",
        video: videoLibrary.mern,
        duration: "40 min",
        resources: resourceLibrary.mongodb
      },
      {
        title: "Schema Design",
        description: "Structure app data for users, content, and relationships.",
        video: videoLibrary.mern,
        duration: "44 min",
        resources: resourceLibrary.mongodb
      },
      {
        title: "Mongoose Integration",
        description: "Use Mongoose models and queries inside Node apps.",
        video: videoLibrary.mern,
        duration: "50 min",
        resources: resourceLibrary.mongodb
      },
      {
        title: "Data Layer Project",
        description: "Build a data layer for a real full-stack app.",
        video: videoLibrary.mern,
        duration: "58 min",
        resources: resourceLibrary.mongodb
      }
    ])
  },
  {
    title: "Full-Stack MERN Bootcamp",
    description: "Build modern web apps with MongoDB, Express, React, and Node. Includes auth and deployment basics.",
    category: "Development",
    subcategory: "Full Stack",
    level: "Intermediate",
    duration: "8 weeks",
    amount: 1499,
    instructor: "Aarav Kapoor",
    tags: ["mern", "full stack", "react", "node", "mongodb"],
    overview: "A complete full-stack learning path for building real MERN applications end to end.",
    requirements: ["JavaScript fundamentals", "Basic HTML/CSS", "React basics helpful"],
    learningOutcomes: [
      "Build a full-stack MERN app",
      "Handle authentication flows",
      "Connect frontend and backend",
      "Deploy a portfolio-ready project"
    ],
    modules: makeModules([
      {
        title: "Project Setup and Architecture",
        description: "Plan the stack, folders, and app structure before building.",
        video: videoLibrary.mern,
        duration: "50 min",
        resources: [resourceLibrary.react[0], resourceLibrary.node[0]]
      },
      {
        title: "Backend APIs and Database",
        description: "Create Express routes and connect MongoDB models.",
        video: videoLibrary.nodeExpress,
        duration: "58 min",
        resources: [resourceLibrary.express[0], resourceLibrary.mongodb[0]]
      },
      {
        title: "React Frontend and State",
        description: "Build frontend views, forms, and API integrations.",
        video: videoLibrary.react,
        duration: "60 min",
        resources: resourceLibrary.react
      },
      {
        title: "Authentication and Deployment",
        description: "Secure routes and prepare your app for deployment.",
        video: videoLibrary.mern,
        duration: "65 min",
        resources: [resourceLibrary.react[0], resourceLibrary.node[0]]
      }
    ])
  },
  {
    title: "Docker for JavaScript Apps",
    description: "Containerize modern web applications with Docker and practical DevOps workflows.",
    category: "Development",
    subcategory: "DevOps",
    level: "Intermediate",
    duration: "3 weeks",
    amount: 1099,
    instructor: "Aarav Kapoor",
    tags: ["docker", "devops", "node", "deployment"],
    overview: "A practical introduction to Docker for developers who want portable local and deployment setups.",
    requirements: ["Basic command line", "Node app familiarity helpful"],
    learningOutcomes: [
      "Understand containers and images",
      "Write Dockerfiles",
      "Run multi-service apps",
      "Improve local dev consistency"
    ],
    modules: makeModules([
      {
        title: "Docker Fundamentals",
        description: "Learn images, containers, layers, and Docker basics.",
        video: videoLibrary.docker,
        duration: "35 min",
        resources: resourceLibrary.docker
      },
      {
        title: "Dockerizing Node Apps",
        description: "Package backend applications into reproducible containers.",
        video: videoLibrary.docker,
        duration: "42 min",
        resources: resourceLibrary.docker
      },
      {
        title: "Compose and Services",
        description: "Use multiple services together during development.",
        video: videoLibrary.docker,
        duration: "40 min",
        resources: resourceLibrary.docker
      },
      {
        title: "Deployment Workflow",
        description: "Prepare images and deployment-friendly environments.",
        video: videoLibrary.docker,
        duration: "48 min",
        resources: resourceLibrary.docker
      }
    ])
  },

  // Data / AI (10)
  {
    title: "Python for Beginners",
    description: "Start your Python journey with syntax, variables, functions, loops, and practical mini-projects.",
    category: "Data & AI",
    subcategory: "Programming",
    level: "Beginner",
    duration: "5 weeks",
    amount: 899,
    instructor: "Meera Iyer",
    tags: ["python", "beginner", "programming"],
    overview: "A beginner-first Python course that focuses on practical fundamentals and coding confidence.",
    requirements: ["No prior programming required"],
    learningOutcomes: [
      "Write Python programs confidently",
      "Use functions and loops",
      "Work with lists and dictionaries",
      "Build small automation scripts"
    ],
    modules: makeModules([
      {
        title: "Python Syntax and Setup",
        description: "Install Python and learn the building blocks of Python syntax.",
        video: videoLibrary.python,
        duration: "42 min",
        resources: resourceLibrary.python
      },
      {
        title: "Functions and Data Structures",
        description: "Use functions, lists, dictionaries, and tuples effectively.",
        video: videoLibrary.pythonAlt,
        duration: "50 min",
        resources: resourceLibrary.python
      },
      {
        title: "Control Flow and Files",
        description: "Handle loops, conditions, and basic file processing.",
        video: videoLibrary.python,
        duration: "46 min",
        resources: resourceLibrary.python
      },
      {
        title: "Mini Projects",
        description: "Build a few small scripts to reinforce fundamentals.",
        video: videoLibrary.pythonAlt,
        duration: "55 min",
        resources: resourceLibrary.python
      }
    ])
  },
  {
    title: "Python OOP Essentials",
    description: "Learn object-oriented programming concepts in Python through classes, methods, and reusable code design.",
    category: "Data & AI",
    subcategory: "Programming",
    level: "Intermediate",
    duration: "3 weeks",
    amount: 999,
    instructor: "Meera Iyer",
    tags: ["python", "oop", "software design"],
    overview: "A concise practical course on object-oriented thinking in Python.",
    requirements: ["Python basics"],
    learningOutcomes: [
      "Create and use classes",
      "Understand inheritance and composition",
      "Structure reusable code",
      "Read object-oriented codebases more easily"
    ],
    modules: makeModules([
      {
        title: "Classes and Objects",
        description: "Build your first reusable class models in Python.",
        video: videoLibrary.oopPython,
        duration: "35 min",
        resources: resourceLibrary.python
      },
      {
        title: "Methods and Encapsulation",
        description: "Organize logic inside methods and manage object state properly.",
        video: videoLibrary.oopPython,
        duration: "38 min",
        resources: resourceLibrary.python
      },
      {
        title: "Inheritance and Composition",
        description: "Model relationships and reduce duplication in code.",
        video: videoLibrary.oopPython,
        duration: "42 min",
        resources: resourceLibrary.python
      },
      {
        title: "Refactoring Project",
        description: "Refactor procedural code into an object-oriented design.",
        video: videoLibrary.oopPython,
        duration: "50 min",
        resources: resourceLibrary.python
      }
    ])
  },
  {
    title: "Data Analysis with Python",
    description: "Clean, transform, and analyze datasets using pandas and NumPy.",
    category: "Data & AI",
    subcategory: "Data Analysis",
    level: "Beginner",
    duration: "6 weeks",
    amount: 1199,
    instructor: "Meera Iyer",
    tags: ["python", "pandas", "data analysis"],
    overview: "A hands-on data analysis course focused on turning raw data into usable insights.",
    requirements: ["Basic Python helpful"],
    learningOutcomes: [
      "Load and inspect datasets",
      "Clean and transform data",
      "Aggregate and summarize findings",
      "Prepare analysis-ready tables"
    ],
    modules: makeModules([
      {
        title: "Working with DataFrames",
        description: "Load tabular data and navigate pandas workflows effectively.",
        video: videoLibrary.pandas,
        duration: "45 min",
        resources: resourceLibrary.pandas
      },
      {
        title: "Cleaning and Transforming Data",
        description: "Handle nulls, duplicates, types, and reshaping operations.",
        video: videoLibrary.pandas,
        duration: "50 min",
        resources: resourceLibrary.pandas
      },
      {
        title: "Analysis and Aggregation",
        description: "Use grouping, filtering, and summary statistics.",
        video: videoLibrary.pandas,
        duration: "48 min",
        resources: resourceLibrary.pandas
      },
      {
        title: "Mini Analysis Project",
        description: "Analyze a real dataset and present your key findings.",
        video: videoLibrary.dataAnalyst,
        duration: "60 min",
        resources: resourceLibrary.pandas
      }
    ])
  },
  {
    title: "SQL for Data Analysts",
    description: "Use SQL to query, filter, join, group, and analyze business data.",
    category: "Data & AI",
    subcategory: "SQL",
    level: "Beginner",
    duration: "5 weeks",
    amount: 999,
    instructor: "Meera Iyer",
    tags: ["sql", "analytics", "data"],
    overview: "Learn practical SQL for analyst workflows and portfolio projects.",
    requirements: ["No prior SQL required"],
    learningOutcomes: [
      "Write SELECT queries",
      "Use joins and aggregations",
      "Solve business reporting problems",
      "Prepare for analyst interviews"
    ],
    modules: makeModules([
      {
        title: "SQL Foundations",
        description: "Learn databases, tables, rows, and simple queries.",
        video: videoLibrary.sql,
        duration: "42 min",
        resources: resourceLibrary.sql
      },
      {
        title: "Filtering and Sorting",
        description: "Use WHERE, ORDER BY, LIMIT, and aliases effectively.",
        video: videoLibrary.sql,
        duration: "44 min",
        resources: resourceLibrary.sql
      },
      {
        title: "Joins and Aggregations",
        description: "Combine tables and summarize key metrics correctly.",
        video: videoLibrary.sqlAnalytics,
        duration: "50 min",
        resources: resourceLibrary.sql
      },
      {
        title: "Business SQL Practice",
        description: "Solve analyst-style SQL questions with real scenarios.",
        video: videoLibrary.sqlAnalytics,
        duration: "58 min",
        resources: resourceLibrary.sql
      }
    ])
  },
  {
    title: "Excel for Analysts",
    description: "Use spreadsheets for cleaning, formulas, dashboards, and reporting tasks.",
    category: "Data & AI",
    subcategory: "Spreadsheets",
    level: "Beginner",
    duration: "4 weeks",
    amount: 799,
    instructor: "Meera Iyer",
    tags: ["excel", "analytics", "spreadsheets"],
    overview: "Build confidence with real-world spreadsheet workflows used by analysts and operations teams.",
    requirements: ["No prior spreadsheet expertise needed"],
    learningOutcomes: [
      "Use essential formulas",
      "Clean and organize data",
      "Build simple reports",
      "Work faster in spreadsheets"
    ],
    modules: makeModules([
      {
        title: "Excel Navigation and Basics",
        description: "Master workbook structure, data entry, and formatting fundamentals.",
        video: videoLibrary.excel,
        duration: "36 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Formulas and Functions",
        description: "Use common formulas for arithmetic, lookup, and logic.",
        video: videoLibrary.excelFormulas,
        duration: "48 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Sorting, Filtering, and Tables",
        description: "Organize large datasets for analysis and reporting.",
        video: videoLibrary.excel,
        duration: "40 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Reporting Project",
        description: "Build an analyst-friendly tracking sheet and summary view.",
        video: videoLibrary.excel,
        duration: "55 min",
        resources: resourceLibrary.excel
      }
    ])
  },
  {
    title: "Power BI Dashboard Basics",
    description: "Create business dashboards and visual reports from structured datasets.",
    category: "Data & AI",
    subcategory: "BI Tools",
    level: "Beginner",
    duration: "4 weeks",
    amount: 1199,
    instructor: "Meera Iyer",
    tags: ["power bi", "dashboards", "analytics"],
    overview: "A beginner-friendly dashboarding course for reporting, KPIs, and business visibility.",
    requirements: ["Basic data comfort", "Excel helpful"],
    learningOutcomes: [
      "Model basic data in BI tools",
      "Create charts and KPI cards",
      "Build dashboard layouts",
      "Present insights clearly"
    ],
    modules: makeModules([
      {
        title: "Dashboard Thinking",
        description: "Learn what makes dashboards useful and decision-focused.",
        video: videoLibrary.dataAnalyst,
        duration: "30 min",
        resources: []
      },
      {
        title: "Data Preparation Basics",
        description: "Structure imported data before building visuals.",
        video: videoLibrary.dataAnalyst,
        duration: "35 min",
        resources: []
      },
      {
        title: "Building Visual Reports",
        description: "Create common dashboard widgets and KPI panels.",
        video: videoLibrary.dataAnalyst,
        duration: "40 min",
        resources: []
      },
      {
        title: "Business Dashboard Project",
        description: "Assemble a multi-section dashboard from a realistic dataset.",
        video: videoLibrary.dataAnalyst,
        duration: "50 min",
        resources: []
      }
    ])
  },
  {
    title: "Machine Learning Foundations",
    description: "Understand supervised and unsupervised learning with beginner-friendly examples and workflows.",
    category: "Data & AI",
    subcategory: "Machine Learning",
    level: "Beginner",
    duration: "6 weeks",
    amount: 1399,
    instructor: "Meera Iyer",
    tags: ["machine learning", "python", "scikit-learn"],
    overview: "A first machine learning course designed to make core ideas intuitive and practical.",
    requirements: ["Python basics", "Basic algebra helpful"],
    learningOutcomes: [
      "Understand ML problem types",
      "Train simple models",
      "Evaluate basic model performance",
      "Use scikit-learn workflows"
    ],
    modules: makeModules([
      {
        title: "What is Machine Learning?",
        description: "Understand use cases, supervised learning, and model intuition.",
        video: videoLibrary.machineLearning,
        duration: "38 min",
        resources: resourceLibrary.sklearn
      },
      {
        title: "Training Your First Models",
        description: "Work through a simple end-to-end training workflow.",
        video: videoLibrary.machineLearning,
        duration: "46 min",
        resources: resourceLibrary.sklearn
      },
      {
        title: "Evaluation Basics",
        description: "Interpret metrics and avoid common beginner mistakes.",
        video: videoLibrary.machineLearning,
        duration: "42 min",
        resources: resourceLibrary.sklearn
      },
      {
        title: "Mini ML Project",
        description: "Complete a beginner-level project using scikit-learn.",
        video: videoLibrary.machineLearning,
        duration: "58 min",
        resources: resourceLibrary.sklearn
      }
    ])
  },
  {
    title: "Data Visualization Essentials",
    description: "Present insights through clear charts, storytelling, and basic visualization principles.",
    category: "Data & AI",
    subcategory: "Visualization",
    level: "Beginner",
    duration: "3 weeks",
    amount: 899,
    instructor: "Meera Iyer",
    tags: ["data visualization", "charts", "storytelling"],
    overview: "Learn how to choose effective charts and communicate insights clearly to stakeholders.",
    requirements: ["Basic data familiarity"],
    learningOutcomes: [
      "Choose the right chart for the job",
      "Avoid cluttered visuals",
      "Tell a clear story with data",
      "Improve stakeholder communication"
    ],
    modules: makeModules([
      {
        title: "Visualization Fundamentals",
        description: "Understand chart types, visual hierarchy, and readability.",
        video: videoLibrary.dataAnalyst,
        duration: "30 min",
        resources: []
      },
      {
        title: "Common Analysis Charts",
        description: "Use bar, line, scatter, and category comparison visuals appropriately.",
        video: videoLibrary.dataAnalyst,
        duration: "34 min",
        resources: []
      },
      {
        title: "Storytelling with Data",
        description: "Frame insights around decisions, not just charts.",
        video: videoLibrary.dataAnalyst,
        duration: "32 min",
        resources: []
      },
      {
        title: "Visualization Case Study",
        description: "Build a concise visual story from a small dataset.",
        video: videoLibrary.dataAnalyst,
        duration: "40 min",
        resources: []
      }
    ])
  },
  {
    title: "Python for Automation",
    description: "Use Python to automate repetitive tasks, work with files, and improve productivity.",
    category: "Data & AI",
    subcategory: "Automation",
    level: "Intermediate",
    duration: "4 weeks",
    amount: 999,
    instructor: "Meera Iyer",
    tags: ["python", "automation", "productivity"],
    overview: "A practical automation course focused on scripts that save time in real workflows.",
    requirements: ["Python basics"],
    learningOutcomes: [
      "Automate repetitive tasks",
      "Process files and folders",
      "Build utility scripts",
      "Improve productivity with code"
    ],
    modules: makeModules([
      {
        title: "Automation Mindset",
        description: "Identify workflow pain points worth automating first.",
        video: videoLibrary.python,
        duration: "28 min",
        resources: resourceLibrary.python
      },
      {
        title: "Files and OS Automation",
        description: "Use Python to rename, organize, and process files.",
        video: videoLibrary.pythonAlt,
        duration: "42 min",
        resources: resourceLibrary.python
      },
      {
        title: "Data Workflow Automation",
        description: "Automate repeated reporting or analysis prep tasks.",
        video: videoLibrary.pandas,
        duration: "45 min",
        resources: resourceLibrary.pandas
      },
      {
        title: "Utility Script Project",
        description: "Build a simple automation script end to end.",
        video: videoLibrary.pythonAlt,
        duration: "50 min",
        resources: resourceLibrary.python
      }
    ])
  },
  {
    title: "Data Structures in Python",
    description: "Prepare for technical interviews and stronger coding skills with data structures and algorithms basics.",
    category: "Data & AI",
    subcategory: "DSA",
    level: "Intermediate",
    duration: "5 weeks",
    amount: 1099,
    instructor: "Meera Iyer",
    tags: ["python", "dsa", "interview prep"],
    overview: "A practical DSA starter course built around Python implementations and interview patterns.",
    requirements: ["Python fundamentals"],
    learningOutcomes: [
      "Understand core data structures",
      "Implement stacks, queues, and trees",
      "Reason about algorithm complexity",
      "Practice coding interview fundamentals"
    ],
    modules: makeModules([
      {
        title: "Complexity and Arrays",
        description: "Build intuition for time/space tradeoffs and list operations.",
        video: videoLibrary.dsaPython,
        duration: "42 min",
        resources: resourceLibrary.python
      },
      {
        title: "Stacks, Queues, and Hash Maps",
        description: "Use the most common interview-friendly structures.",
        video: videoLibrary.dsaPython,
        duration: "46 min",
        resources: resourceLibrary.python
      },
      {
        title: "Trees and Graph Basics",
        description: "Understand traversal patterns and common structures.",
        video: videoLibrary.dsaPython,
        duration: "50 min",
        resources: resourceLibrary.python
      },
      {
        title: "Interview Problem Practice",
        description: "Apply DSA concepts to classic problem-solving tasks.",
        video: videoLibrary.dsaPython,
        duration: "58 min",
        resources: resourceLibrary.python
      }
    ])
  },

  // Design (8)
  {
    title: "UI Design Fundamentals",
    description: "Learn spacing, typography, color, hierarchy, and modern interface design principles.",
    category: "Design",
    subcategory: "UI Design",
    level: "Beginner",
    duration: "4 weeks",
    amount: 899,
    instructor: "Sara Khan",
    tags: ["ui design", "visual design", "product design"],
    overview: "A practical course for designing cleaner and more usable interfaces.",
    requirements: ["No prior design tools required"],
    learningOutcomes: [
      "Understand visual hierarchy",
      "Use spacing and typography well",
      "Create cleaner interfaces",
      "Design consistent UI screens"
    ],
    modules: makeModules([
      {
        title: "Design Principles Basics",
        description: "Understand alignment, contrast, hierarchy, and layout balance.",
        video: videoLibrary.figmaUiUx,
        duration: "35 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Typography and Color",
        description: "Use typography and color systems effectively in UI.",
        video: videoLibrary.figmaUiUx,
        duration: "38 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Spacing and Layout",
        description: "Build more polished designs using spacing systems.",
        video: videoLibrary.figmaUiUx,
        duration: "34 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Screen Design Practice",
        description: "Apply the principles to a realistic app screen design.",
        video: videoLibrary.figmaUiUx,
        duration: "45 min",
        resources: resourceLibrary.figma
      }
    ])
  },
  {
    title: "UX Design Foundations",
    description: "Understand user needs, flows, wireframes, and usability basics for digital products.",
    category: "Design",
    subcategory: "UX Design",
    level: "Beginner",
    duration: "4 weeks",
    amount: 999,
    instructor: "Sara Khan",
    tags: ["ux", "research", "usability"],
    overview: "A beginner UX course centered on solving user problems through thoughtful product decisions.",
    requirements: ["No design experience required"],
    learningOutcomes: [
      "Understand core UX process",
      "Map user journeys",
      "Create wireframes",
      "Think through usability decisions"
    ],
    modules: makeModules([
      {
        title: "What is UX?",
        description: "Learn the scope of UX and how it differs from visual design.",
        video: videoLibrary.figmaUiUx,
        duration: "30 min",
        resources: resourceLibrary.figma
      },
      {
        title: "User Flows and Structure",
        description: "Map flows and organize screen progression clearly.",
        video: videoLibrary.figmaUiUx,
        duration: "34 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Wireframes and Low-Fidelity Design",
        description: "Create quick exploratory layouts before polished UI work.",
        video: videoLibrary.figmaUiUx,
        duration: "36 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Usability Review Practice",
        description: "Evaluate an interface and improve its UX with rationale.",
        video: videoLibrary.figmaUiUx,
        duration: "42 min",
        resources: resourceLibrary.figma
      }
    ])
  },
  {
    title: "Figma for Beginners",
    description: "Design interfaces, use frames and components, and prototype product ideas in Figma.",
    category: "Design",
    subcategory: "Figma",
    level: "Beginner",
    duration: "3 weeks",
    amount: 799,
    instructor: "Sara Khan",
    tags: ["figma", "ui", "prototyping"],
    overview: "A hands-on Figma starter course for students, developers, and aspiring designers.",
    requirements: ["No prior Figma knowledge"],
    learningOutcomes: [
      "Navigate the Figma interface",
      "Create frames and components",
      "Prototype screens",
      "Work faster with design systems"
    ],
    modules: makeModules([
      {
        title: "Figma Workspace Basics",
        description: "Learn tools, frames, layers, and simple design workflows.",
        video: videoLibrary.figma,
        duration: "30 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Components and Variants",
        description: "Build reusable interface patterns and scalable systems.",
        video: videoLibrary.figma,
        duration: "36 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Prototyping",
        description: "Connect screens and simulate real user flows.",
        video: videoLibrary.figma,
        duration: "32 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Mini App Design",
        description: "Design and prototype a small product experience in Figma.",
        video: videoLibrary.figma,
        duration: "42 min",
        resources: resourceLibrary.figma
      }
    ])
  },
  {
    title: "Design Systems for Product Teams",
    description: "Create scalable UI systems with tokens, components, and reusable design patterns.",
    category: "Design",
    subcategory: "Design Systems",
    level: "Intermediate",
    duration: "4 weeks",
    amount: 1199,
    instructor: "Sara Khan",
    tags: ["design systems", "figma", "product design"],
    overview: "Learn to standardize interfaces and create scalable systems across product surfaces.",
    requirements: ["Figma basics", "UI basics"],
    learningOutcomes: [
      "Define reusable components",
      "Create naming and token systems",
      "Improve consistency across teams",
      "Scale product UI more effectively"
    ],
    modules: makeModules([
      {
        title: "Design System Basics",
        description: "Understand why teams use systems and what they include.",
        video: videoLibrary.designSystem,
        duration: "35 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Component Libraries",
        description: "Create reusable buttons, inputs, cards, and layout primitives.",
        video: videoLibrary.designSystem,
        duration: "40 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Tokens and Naming",
        description: "Define scalable naming conventions and visual tokens.",
        video: videoLibrary.designSystem,
        duration: "38 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Systemization Project",
        description: "Refactor inconsistent UI into a cohesive design system.",
        video: videoLibrary.designSystem,
        duration: "50 min",
        resources: resourceLibrary.figma
      }
    ])
  },
  {
    title: "Prototyping in Figma",
    description: "Turn static screens into clickable, testable product prototypes.",
    category: "Design",
    subcategory: "Figma",
    level: "Intermediate",
    duration: "3 weeks",
    amount: 899,
    instructor: "Sara Khan",
    tags: ["figma", "prototype", "ux"],
    overview: "Learn to simulate real product interactions and review flows before development.",
    requirements: ["Basic Figma usage"],
    learningOutcomes: [
      "Create interactive prototypes",
      "Map transitions and user flows",
      "Present concepts more clearly",
      "Test ideas before development"
    ],
    modules: makeModules([
      {
        title: "Prototype Flow Basics",
        description: "Connect screens and create intuitive navigation paths.",
        video: videoLibrary.figma,
        duration: "28 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Micro-Interactions",
        description: "Use transitions and motion thoughtfully in prototypes.",
        video: videoLibrary.figma,
        duration: "30 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Scenario Walkthroughs",
        description: "Build realistic user scenarios for review and testing.",
        video: videoLibrary.figma,
        duration: "34 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Prototype Review Project",
        description: "Create a polished multi-screen prototype presentation.",
        video: videoLibrary.figma,
        duration: "40 min",
        resources: resourceLibrary.figma
      }
    ])
  },
  {
    title: "Mobile App UI Design",
    description: "Design modern mobile app interfaces with hierarchy, consistency, and polished flows.",
    category: "Design",
    subcategory: "Mobile UI",
    level: "Intermediate",
    duration: "4 weeks",
    amount: 1099,
    instructor: "Sara Khan",
    tags: ["mobile ui", "figma", "app design"],
    overview: "A practical course for creating cleaner and more consistent mobile product screens.",
    requirements: ["Basic UI design understanding"],
    learningOutcomes: [
      "Design mobile-first layouts",
      "Use mobile patterns well",
      "Create consistent screen flows",
      "Build polished app mockups"
    ],
    modules: makeModules([
      {
        title: "Mobile Layout Patterns",
        description: "Understand mobile-first design patterns and spacing systems.",
        video: videoLibrary.figmaUiUx,
        duration: "32 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Navigation and Flows",
        description: "Design intuitive mobile navigation experiences.",
        video: videoLibrary.figmaUiUx,
        duration: "35 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Components for Mobile",
        description: "Create scalable components for app interfaces.",
        video: videoLibrary.figmaUiUx,
        duration: "36 min",
        resources: resourceLibrary.figma
      },
      {
        title: "Mobile UI Project",
        description: "Design a polished mobile flow from idea to screens.",
        video: videoLibrary.figmaUiUx,
        duration: "45 min",
        resources: resourceLibrary.figma
      }
    ])
  },
  {
    title: "UX Writing Basics",
    description: "Write interface copy that helps users complete tasks clearly and confidently.",
    category: "Design",
    subcategory: "Content Design",
    level: "Beginner",
    duration: "2 weeks",
    amount: 699,
    instructor: "Sara Khan",
    tags: ["ux writing", "content design", "microcopy"],
    overview: "Learn how product copy impacts usability, trust, and conversion.",
    requirements: ["None"],
    learningOutcomes: [
      "Write clearer UI copy",
      "Improve onboarding and error messages",
      "Reduce user confusion",
      "Create more human product experiences"
    ],
    modules: makeModules([
      {
        title: "UX Writing Principles",
        description: "Learn clarity, brevity, and consistency for product copy.",
        video: videoLibrary.figmaUiUx,
        duration: "24 min",
        resources: []
      },
      {
        title: "Microcopy for Flows",
        description: "Write better onboarding, forms, and calls to action.",
        video: videoLibrary.figmaUiUx,
        duration: "26 min",
        resources: []
      },
      {
        title: "Error States and Guidance",
        description: "Help users recover gracefully with stronger messaging.",
        video: videoLibrary.figmaUiUx,
        duration: "22 min",
        resources: []
      },
      {
        title: "Content Critique Practice",
        description: "Rewrite product copy to improve usability and confidence.",
        video: videoLibrary.figmaUiUx,
        duration: "28 min",
        resources: []
      }
    ])
  },
  {
    title: "Portfolio Design for Creators",
    description: "Design a strong portfolio that communicates your strengths and projects clearly.",
    category: "Design",
    subcategory: "Portfolio",
    level: "Beginner",
    duration: "2 weeks",
    amount: 699,
    instructor: "Sara Khan",
    tags: ["portfolio", "personal branding", "design"],
    overview: "A practical course for students and early-career professionals building a stronger portfolio presence.",
    requirements: ["A few project ideas or examples"],
    learningOutcomes: [
      "Present projects more effectively",
      "Create cleaner portfolio structure",
      "Improve visual storytelling",
      "Increase hiring-readiness"
    ],
    modules: makeModules([
      {
        title: "Portfolio Structure",
        description: "Understand what to include and how to sequence it.",
        video: videoLibrary.figmaUiUx,
        duration: "22 min",
        resources: []
      },
      {
        title: "Project Storytelling",
        description: "Frame your projects using problem, process, and impact.",
        video: videoLibrary.figmaUiUx,
        duration: "24 min",
        resources: []
      },
      {
        title: "Visual Presentation",
        description: "Use layouts and hierarchy to improve readability.",
        video: videoLibrary.figmaUiUx,
        duration: "24 min",
        resources: []
      },
      {
        title: "Portfolio Review Checklist",
        description: "Audit and improve your portfolio before publishing.",
        video: videoLibrary.figmaUiUx,
        duration: "26 min",
        resources: []
      }
    ])
  },

  // Business / Productivity / Career (12)
  {
    title: "Digital Marketing Basics",
    description: "Learn channels, funnels, content, and beginner-friendly campaign strategy.",
    category: "Business",
    subcategory: "Marketing",
    level: "Beginner",
    duration: "4 weeks",
    amount: 899,
    instructor: "Rohan Singh",
    tags: ["marketing", "digital", "growth"],
    overview: "A foundational digital marketing course for students, creators, and small business learners.",
    requirements: ["None"],
    learningOutcomes: [
      "Understand core marketing channels",
      "Think in terms of funnels and conversions",
      "Plan simple campaigns",
      "Measure basic outcomes"
    ],
    modules: makeModules([
      {
        title: "Marketing Channel Basics",
        description: "Explore content, social, email, paid, and search channels.",
        video: videoLibrary.dataAnalyst,
        duration: "26 min",
        resources: []
      },
      {
        title: "Audience and Messaging",
        description: "Clarify who you are targeting and what to say.",
        video: videoLibrary.dataAnalyst,
        duration: "28 min",
        resources: []
      },
      {
        title: "Campaign Thinking",
        description: "Plan simple campaigns with clear goals and metrics.",
        video: videoLibrary.dataAnalyst,
        duration: "30 min",
        resources: []
      },
      {
        title: "Starter Campaign Project",
        description: "Outline a small campaign for a product or service.",
        video: videoLibrary.dataAnalyst,
        duration: "36 min",
        resources: []
      }
    ])
  },
  {
    title: "Business Analytics Foundations",
    description: "Use data to answer business questions and support decision-making.",
    category: "Business",
    subcategory: "Analytics",
    level: "Beginner",
    duration: "4 weeks",
    amount: 999,
    instructor: "Rohan Singh",
    tags: ["business analytics", "kpi", "reporting"],
    overview: "A business-focused analytics course that bridges data and decision-making.",
    requirements: ["Basic spreadsheet familiarity helpful"],
    learningOutcomes: [
      "Think in terms of KPIs",
      "Ask stronger business questions",
      "Interpret reports more confidently",
      "Communicate insights clearly"
    ],
    modules: makeModules([
      {
        title: "Business Questions and Metrics",
        description: "Define goals and choose meaningful KPIs.",
        video: videoLibrary.dataAnalyst,
        duration: "28 min",
        resources: []
      },
      {
        title: "Using Reports Effectively",
        description: "Read and interpret data summaries with context.",
        video: videoLibrary.dataAnalyst,
        duration: "30 min",
        resources: []
      },
      {
        title: "Insight Communication",
        description: "Turn numbers into action-oriented takeaways.",
        video: videoLibrary.dataAnalyst,
        duration: "30 min",
        resources: []
      },
      {
        title: "Business Case Practice",
        description: "Work through a reporting case from start to finish.",
        video: videoLibrary.dataAnalyst,
        duration: "40 min",
        resources: []
      }
    ])
  },
  {
    title: "Project Management Essentials",
    description: "Plan, prioritize, and deliver projects with timelines, milestones, and stakeholder communication.",
    category: "Business",
    subcategory: "Project Management",
    level: "Beginner",
    duration: "3 weeks",
    amount: 899,
    instructor: "Rohan Singh",
    tags: ["project management", "planning", "delivery"],
    overview: "A practical PM starter course for team projects, freelance work, and product execution.",
    requirements: ["None"],
    learningOutcomes: [
      "Break work into manageable tasks",
      "Plan timelines and milestones",
      "Communicate project status",
      "Reduce chaos in execution"
    ],
    modules: makeModules([
      {
        title: "Planning Fundamentals",
        description: "Learn scope, milestones, and task breakdown basics.",
        video: videoLibrary.dataAnalyst,
        duration: "25 min",
        resources: []
      },
      {
        title: "Prioritization and Execution",
        description: "Organize work and keep delivery on track.",
        video: videoLibrary.dataAnalyst,
        duration: "28 min",
        resources: []
      },
      {
        title: "Stakeholder Communication",
        description: "Share updates and manage project expectations effectively.",
        video: videoLibrary.dataAnalyst,
        duration: "24 min",
        resources: []
      },
      {
        title: "Project Plan Exercise",
        description: "Draft a practical project plan for a sample initiative.",
        video: videoLibrary.dataAnalyst,
        duration: "32 min",
        resources: []
      }
    ])
  },
  {
    title: "Excel Dashboard Reporting",
    description: "Build simple dashboard-style reports in spreadsheets for business and operations use cases.",
    category: "Business",
    subcategory: "Spreadsheets",
    level: "Intermediate",
    duration: "3 weeks",
    amount: 899,
    instructor: "Rohan Singh",
    tags: ["excel", "dashboard", "reporting"],
    overview: "Turn spreadsheet data into easier-to-understand reports and dashboard layouts.",
    requirements: ["Basic Excel knowledge"],
    learningOutcomes: [
      "Create summary dashboards",
      "Use formulas for reporting",
      "Improve spreadsheet readability",
      "Present metrics more clearly"
    ],
    modules: makeModules([
      {
        title: "Dashboard Planning",
        description: "Decide what metrics matter and how to structure them.",
        video: videoLibrary.excel,
        duration: "24 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Formulas for Reporting",
        description: "Use lookups, counts, and conditional logic for dashboards.",
        video: videoLibrary.excelFormulas,
        duration: "34 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Visual Layout in Spreadsheets",
        description: "Build clean and scannable dashboard sections.",
        video: videoLibrary.excel,
        duration: "26 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Reporting Dashboard Project",
        description: "Create a spreadsheet dashboard from a sample dataset.",
        video: videoLibrary.excel,
        duration: "38 min",
        resources: resourceLibrary.excel
      }
    ])
  },
  {
    title: "Resume & LinkedIn Mastery",
    description: "Improve your resume, LinkedIn presence, and role targeting for job applications.",
    category: "Career",
    subcategory: "Job Search",
    level: "Beginner",
    duration: "2 weeks",
    amount: 699,
    instructor: "Rohan Singh",
    tags: ["resume", "linkedin", "career"],
    overview: "A focused job-search course for students and professionals improving visibility and clarity.",
    requirements: ["A current resume or draft"],
    learningOutcomes: [
      "Improve resume structure",
      "Write better bullet points",
      "Upgrade LinkedIn visibility",
      "Tailor applications more effectively"
    ],
    modules: makeModules([
      {
        title: "Resume Structure Basics",
        description: "Organize sections for clarity and hiring relevance.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Writing Strong Impact Bullets",
        description: "Turn tasks into outcomes and achievements.",
        video: videoLibrary.dataAnalyst,
        duration: "20 min",
        resources: []
      },
      {
        title: "LinkedIn Profile Improvement",
        description: "Strengthen headlines, summaries, and credibility signals.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Application Tailoring",
        description: "Match your positioning to specific job descriptions.",
        video: videoLibrary.dataAnalyst,
        duration: "22 min",
        resources: []
      }
    ])
  },
  {
    title: "Technical Interview Basics",
    description: "Prepare for common technical interview formats, expectations, and communication strategies.",
    category: "Career",
    subcategory: "Interview Prep",
    level: "Beginner",
    duration: "2 weeks",
    amount: 799,
    instructor: "Rohan Singh",
    tags: ["interview", "technical", "job prep"],
    overview: "A practical interview-prep course for early-career learners entering technical hiring processes.",
    requirements: ["Interest in technical roles"],
    learningOutcomes: [
      "Understand interview formats",
      "Prepare examples more effectively",
      "Communicate more confidently",
      "Reduce interview anxiety"
    ],
    modules: makeModules([
      {
        title: "Technical Interview Formats",
        description: "Understand screening, live coding, and behavioral loops.",
        video: videoLibrary.dsaPython,
        duration: "16 min",
        resources: []
      },
      {
        title: "Answering Questions Clearly",
        description: "Structure technical responses and clarify your thinking.",
        video: videoLibrary.dsaPython,
        duration: "18 min",
        resources: []
      },
      {
        title: "Portfolio and Project Discussion",
        description: "Present your projects with stronger storytelling.",
        video: videoLibrary.dsaPython,
        duration: "20 min",
        resources: []
      },
      {
        title: "Interview Practice Checklist",
        description: "Prepare a repeatable system for interview readiness.",
        video: videoLibrary.dsaPython,
        duration: "18 min",
        resources: []
      }
    ])
  },
  {
    title: "Communication Skills for Professionals",
    description: "Improve clarity, confidence, and structure in workplace communication.",
    category: "Career",
    subcategory: "Soft Skills",
    level: "Beginner",
    duration: "2 weeks",
    amount: 699,
    instructor: "Rohan Singh",
    tags: ["communication", "soft skills", "professional growth"],
    overview: "A concise communication course for speaking and writing more clearly in team settings.",
    requirements: ["None"],
    learningOutcomes: [
      "Communicate with more clarity",
      "Structure updates better",
      "Improve meeting contributions",
      "Write more effective workplace messages"
    ],
    modules: makeModules([
      {
        title: "Clear Communication Basics",
        description: "Reduce ambiguity and improve structure in speaking and writing.",
        video: videoLibrary.dataAnalyst,
        duration: "16 min",
        resources: []
      },
      {
        title: "Meetings and Updates",
        description: "Share progress and blockers concisely and professionally.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Feedback and Collaboration",
        description: "Handle feedback and team communication more constructively.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Communication Practice Exercises",
        description: "Apply frameworks to real workplace scenarios.",
        video: videoLibrary.dataAnalyst,
        duration: "22 min",
        resources: []
      }
    ])
  },
  {
    title: "Aptitude & Logical Reasoning",
    description: "Practice patterns, quantitative reasoning, and problem-solving for assessments and interviews.",
    category: "Career",
    subcategory: "Aptitude",
    level: "Beginner",
    duration: "3 weeks",
    amount: 799,
    instructor: "Rohan Singh",
    tags: ["aptitude", "reasoning", "interview prep"],
    overview: "Strengthen your speed and confidence for aptitude and reasoning rounds.",
    requirements: ["Basic school-level math"],
    learningOutcomes: [
      "Approach aptitude questions faster",
      "Recognize common reasoning patterns",
      "Improve accuracy under time pressure",
      "Build confidence for tests"
    ],
    modules: makeModules([
      {
        title: "Core Aptitude Patterns",
        description: "Understand major quantitative and reasoning question types.",
        video: videoLibrary.dataAnalyst,
        duration: "22 min",
        resources: []
      },
      {
        title: "Shortcuts and Mental Models",
        description: "Solve common test problems more efficiently.",
        video: videoLibrary.dataAnalyst,
        duration: "24 min",
        resources: []
      },
      {
        title: "Timed Practice Strategy",
        description: "Manage pressure and make smarter question choices.",
        video: videoLibrary.dataAnalyst,
        duration: "20 min",
        resources: []
      },
      {
        title: "Mock Reasoning Set",
        description: "Practice a compact set of aptitude-style questions.",
        video: videoLibrary.dataAnalyst,
        duration: "25 min",
        resources: []
      }
    ])
  },
  {
    title: "Freelancing Fundamentals",
    description: "Learn pricing, positioning, proposals, and client communication for freelance work.",
    category: "Career",
    subcategory: "Freelancing",
    level: "Beginner",
    duration: "3 weeks",
    amount: 899,
    instructor: "Rohan Singh",
    tags: ["freelancing", "clients", "career"],
    overview: "A starter course for learners who want to earn through freelance projects or side gigs.",
    requirements: ["At least one skill you can offer"],
    learningOutcomes: [
      "Define a basic service offer",
      "Price work more confidently",
      "Communicate with clients better",
      "Deliver freelance projects more smoothly"
    ],
    modules: makeModules([
      {
        title: "Freelance Positioning",
        description: "Identify your offer and shape it around market demand.",
        video: videoLibrary.dataAnalyst,
        duration: "20 min",
        resources: []
      },
      {
        title: "Pricing and Scope",
        description: "Set realistic boundaries and project expectations.",
        video: videoLibrary.dataAnalyst,
        duration: "22 min",
        resources: []
      },
      {
        title: "Proposals and Client Messages",
        description: "Write stronger outreach and proposal copy.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Project Delivery Workflow",
        description: "Run freelance projects more professionally end to end.",
        video: videoLibrary.dataAnalyst,
        duration: "24 min",
        resources: []
      }
    ])
  },
  {
    title: "Prompt Engineering Basics",
    description: "Learn how to write better prompts for AI tools across writing, coding, and workflow tasks.",
    category: "Career",
    subcategory: "AI Productivity",
    level: "Beginner",
    duration: "2 weeks",
    amount: 799,
    instructor: "Rohan Singh",
    tags: ["ai", "prompt engineering", "productivity"],
    overview: "A practical starter course for using AI tools more effectively in day-to-day work.",
    requirements: ["Basic familiarity with AI chat tools helpful"],
    learningOutcomes: [
      "Write clearer prompts",
      "Reduce vague model output",
      "Create reusable prompt patterns",
      "Use AI tools more productively"
    ],
    modules: makeModules([
      {
        title: "Prompt Structure Basics",
        description: "Understand role, context, constraints, and output format.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Prompting for Writing and Research",
        description: "Improve quality for summaries, notes, and drafts.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Prompting for Coding and Analysis",
        description: "Use structured prompts for technical tasks and debugging.",
        video: videoLibrary.dataAnalyst,
        duration: "20 min",
        resources: []
      },
      {
        title: "Reusable Prompt Library",
        description: "Build a starter set of repeatable prompt templates.",
        video: videoLibrary.dataAnalyst,
        duration: "22 min",
        resources: []
      }
    ])
  },
  {
    title: "Productivity with Notion & Docs",
    description: "Organize notes, tasks, and personal systems for learning and work.",
    category: "Business",
    subcategory: "Productivity",
    level: "Beginner",
    duration: "2 weeks",
    amount: 599,
    instructor: "Rohan Singh",
    tags: ["productivity", "notion", "organization"],
    overview: "A simple productivity course for building repeatable personal operating systems.",
    requirements: ["None"],
    learningOutcomes: [
      "Organize tasks and notes better",
      "Track goals more consistently",
      "Create simple personal systems",
      "Reduce workflow friction"
    ],
    modules: makeModules([
      {
        title: "Personal Workflow Setup",
        description: "Build a simple foundation for managing tasks and notes.",
        video: videoLibrary.dataAnalyst,
        duration: "16 min",
        resources: []
      },
      {
        title: "Structuring Projects and Notes",
        description: "Create useful systems for learning and execution.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Dashboards and Templates",
        description: "Create reusable pages and simple dashboards.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Personal Productivity Setup",
        description: "Assemble a clean productivity workspace from scratch.",
        video: videoLibrary.dataAnalyst,
        duration: "20 min",
        resources: []
      }
    ])
  },

  // Extra catalog expansion (10)
  {
    title: "CSS Grid & Flexbox Mastery",
    description: "Master modern CSS layout systems for responsive websites and web applications.",
    category: "Development",
    subcategory: "Frontend",
    level: "Intermediate",
    duration: "3 weeks",
    amount: 899,
    instructor: "Aarav Kapoor",
    tags: ["css", "grid", "flexbox", "responsive"],
    overview: "Deepen your layout skills with modern CSS patterns used in real interfaces.",
    requirements: ["Basic HTML/CSS"],
    learningOutcomes: [
      "Use Grid and Flexbox confidently",
      "Solve common layout problems",
      "Build responsive sections faster",
      "Create cleaner frontend architecture"
    ],
    modules: makeModules([
      {
        title: "Flexbox in Practice",
        description: "Use one-dimensional layouts effectively for common UI sections.",
        video: videoLibrary.htmlCss,
        duration: "30 min",
        resources: []
      },
      {
        title: "CSS Grid Foundations",
        description: "Create two-dimensional layouts with precision and confidence.",
        video: videoLibrary.htmlCss,
        duration: "34 min",
        resources: []
      },
      {
        title: "Responsive Layout Patterns",
        description: "Combine Grid, Flexbox, and media queries in realistic scenarios.",
        video: videoLibrary.htmlCss,
        duration: "32 min",
        resources: []
      },
      {
        title: "Layout Challenge Project",
        description: "Build a polished responsive multi-section page layout.",
        video: videoLibrary.htmlCss,
        duration: "42 min",
        resources: []
      }
    ])
  },
  {
    title: "React Project Portfolio Builder",
    description: "Build portfolio-quality React projects that demonstrate practical frontend skills.",
    category: "Development",
    subcategory: "Frontend",
    level: "Intermediate",
    duration: "4 weeks",
    amount: 1099,
    instructor: "Aarav Kapoor",
    tags: ["react", "portfolio", "projects"],
    overview: "A build-first course for turning React knowledge into showcase-ready portfolio work.",
    requirements: ["React fundamentals"],
    learningOutcomes: [
      "Build stronger portfolio projects",
      "Apply React in practical scenarios",
      "Improve project structuring",
      "Showcase frontend skills better"
    ],
    modules: makeModules([
      {
        title: "Choosing the Right Project",
        description: "Select project ideas that show practical skills and decision-making.",
        video: videoLibrary.react,
        duration: "24 min",
        resources: resourceLibrary.react
      },
      {
        title: "Architecture and Components",
        description: "Organize project structure before implementation grows messy.",
        video: videoLibrary.reactAlt,
        duration: "30 min",
        resources: resourceLibrary.react
      },
      {
        title: "Polish and UX Improvements",
        description: "Improve the quality and usability of your React interfaces.",
        video: videoLibrary.reactAlt,
        duration: "28 min",
        resources: resourceLibrary.react
      },
      {
        title: "Portfolio Presentation",
        description: "Present your project with stronger context, visuals, and clarity.",
        video: videoLibrary.react,
        duration: "30 min",
        resources: resourceLibrary.react
      }
    ])
  },
  {
    title: "API Integration in Frontend Apps",
    description: "Connect frontend interfaces to backend APIs using clean loading, error, and data state handling.",
    category: "Development",
    subcategory: "Frontend",
    level: "Intermediate",
    duration: "3 weeks",
    amount: 999,
    instructor: "Aarav Kapoor",
    tags: ["api", "frontend", "react", "integration"],
    overview: "A practical course on consuming APIs well in real frontend applications.",
    requirements: ["JavaScript basics", "React basics helpful"],
    learningOutcomes: [
      "Handle API calls safely",
      "Manage loading and error states",
      "Structure fetch logic cleanly",
      "Build more realistic apps"
    ],
    modules: makeModules([
      {
        title: "Client-Server Basics",
        description: "Understand requests, responses, and JSON-driven UIs.",
        video: videoLibrary.nodeExpress,
        duration: "24 min",
        resources: resourceLibrary.express
      },
      {
        title: "Fetching and State Handling",
        description: "Implement loading, success, and failure UX cleanly.",
        video: videoLibrary.react,
        duration: "28 min",
        resources: resourceLibrary.react
      },
      {
        title: "Forms and Mutations",
        description: "Send data to APIs and manage optimistic interfaces.",
        video: videoLibrary.reactAlt,
        duration: "28 min",
        resources: resourceLibrary.react
      },
      {
        title: "API-Driven Project",
        description: "Build a small app powered by real backend data.",
        video: videoLibrary.react,
        duration: "34 min",
        resources: resourceLibrary.react
      }
    ])
  },
  {
    title: "SQL Interview Prep",
    description: "Practice analyst and backend-oriented SQL questions with explanations and patterns.",
    category: "Career",
    subcategory: "Interview Prep",
    level: "Intermediate",
    duration: "3 weeks",
    amount: 999,
    instructor: "Meera Iyer",
    tags: ["sql", "interview", "analytics"],
    overview: "Sharpen your SQL through realistic joins, aggregations, and reporting-style questions.",
    requirements: ["Basic SQL knowledge"],
    learningOutcomes: [
      "Solve SQL interview problems faster",
      "Improve JOIN and GROUP BY confidence",
      "Recognize common interview patterns",
      "Write cleaner SQL under pressure"
    ],
    modules: makeModules([
      {
        title: "SQL Pattern Review",
        description: "Revisit the most common query structures asked in interviews.",
        video: videoLibrary.sqlAnalytics,
        duration: "24 min",
        resources: resourceLibrary.sql
      },
      {
        title: "Join-Focused Questions",
        description: "Practice combining data and interpreting results accurately.",
        video: videoLibrary.sqlAnalytics,
        duration: "26 min",
        resources: resourceLibrary.sql
      },
      {
        title: "Aggregation and Case Practice",
        description: "Use grouping and conditional logic in interview-style questions.",
        video: videoLibrary.sqlAnalytics,
        duration: "28 min",
        resources: resourceLibrary.sql
      },
      {
        title: "Timed SQL Mock",
        description: "Work through a small mock interview problem set.",
        video: videoLibrary.sqlAnalytics,
        duration: "30 min",
        resources: resourceLibrary.sql
      }
    ])
  },
  {
    title: "Excel Formulas for Business Users",
    description: "Master the most useful spreadsheet formulas for reporting, finance, and operations workflows.",
    category: "Business",
    subcategory: "Spreadsheets",
    level: "Intermediate",
    duration: "3 weeks",
    amount: 799,
    instructor: "Rohan Singh",
    tags: ["excel", "formulas", "business"],
    overview: "A formula-first Excel course built around the functions most professionals actually use.",
    requirements: ["Basic Excel comfort"],
    learningOutcomes: [
      "Use core Excel formulas confidently",
      "Reduce manual spreadsheet work",
      "Build cleaner business sheets",
      "Improve accuracy in reporting"
    ],
    modules: makeModules([
      {
        title: "Formula Foundations",
        description: "Understand references, syntax, and workbook logic.",
        video: videoLibrary.excelFormulas,
        duration: "24 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Lookup and Logic Functions",
        description: "Use common formulas for reporting and business decisions.",
        video: videoLibrary.excelFormulas,
        duration: "28 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Dates, Text, and Cleanup",
        description: "Work with text, dates, and data cleanup formulas effectively.",
        video: videoLibrary.excelFormulas,
        duration: "26 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Business Spreadsheet Project",
        description: "Apply formulas to a realistic tracking and reporting file.",
        video: videoLibrary.excelFormulas,
        duration: "32 min",
        resources: resourceLibrary.excel
      }
    ])
  },
  {
    title: "Python in Excel Workflows",
    description: "Use Python concepts in spreadsheet-driven workflows for analysis and automation.",
    category: "Data & AI",
    subcategory: "Automation",
    level: "Intermediate",
    duration: "2 weeks",
    amount: 899,
    instructor: "Meera Iyer",
    tags: ["python", "excel", "automation"],
    overview: "A practical bridge course for learners exploring Python-enabled spreadsheet workflows.",
    requirements: ["Excel basics", "Some Python helpful"],
    learningOutcomes: [
      "Understand Python in spreadsheet contexts",
      "Bridge manual and scripted workflows",
      "Explore automation ideas",
      "Work more efficiently with data tasks"
    ],
    modules: makeModules([
      {
        title: "Python + Spreadsheet Concepts",
        description: "Understand how Python can support spreadsheet-based workflows.",
        video: videoLibrary.pythonExcel,
        duration: "18 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Data Cleanup Patterns",
        description: "Use Python logic to reduce repetitive spreadsheet cleanup.",
        video: videoLibrary.pythonExcel,
        duration: "20 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Analysis Workflows",
        description: "Bridge spreadsheet usage with more advanced analysis workflows.",
        video: videoLibrary.pythonExcel,
        duration: "22 min",
        resources: resourceLibrary.excel
      },
      {
        title: "Mini Workflow Project",
        description: "Plan and improve a spreadsheet-heavy workflow using Python ideas.",
        video: videoLibrary.pythonExcel,
        duration: "24 min",
        resources: resourceLibrary.excel
      }
    ])
  },
  {
    title: "React Native App Basics",
    description: "Build simple cross-platform mobile interfaces with React Native fundamentals.",
    category: "Development",
    subcategory: "Mobile Development",
    level: "Intermediate",
    duration: "5 weeks",
    amount: 1299,
    instructor: "Aarav Kapoor",
    tags: ["react native", "mobile", "react"],
    overview: "A beginner-friendly mobile development course for React developers moving into apps.",
    requirements: ["JavaScript basics", "React helpful"],
    learningOutcomes: [
      "Understand React Native fundamentals",
      "Build basic mobile screens",
      "Use navigation patterns",
      "Ship a starter mobile app"
    ],
    modules: makeModules([
      {
        title: "React Native Setup",
        description: "Understand the mobile environment and core React Native concepts.",
        video: videoLibrary.reactNative,
        duration: "30 min",
        resources: []
      },
      {
        title: "Core Components and Layout",
        description: "Build native-feeling layouts using RN primitives.",
        video: videoLibrary.reactNative,
        duration: "34 min",
        resources: []
      },
      {
        title: "Navigation and State",
        description: "Move between screens and handle mobile app state flows.",
        video: videoLibrary.reactNative,
        duration: "36 min",
        resources: []
      },
      {
        title: "Mini Mobile App",
        description: "Build a simple multi-screen mobile application.",
        video: videoLibrary.reactNative,
        duration: "42 min",
        resources: []
      }
    ])
  },
  {
    title: "Data Analyst Career Roadmap",
    description: "Learn the exact skill map for becoming job-ready as a beginner data analyst.",
    category: "Career",
    subcategory: "Career Path",
    level: "Beginner",
    duration: "2 weeks",
    amount: 699,
    instructor: "Meera Iyer",
    tags: ["data analyst", "career roadmap", "job ready"],
    overview: "A strategic roadmap course that explains which skills to learn and in what order.",
    requirements: ["Interest in data careers"],
    learningOutcomes: [
      "Understand analyst skill progression",
      "Prioritize the right tools first",
      "Plan a portfolio path",
      "Avoid beginner overwhelm"
    ],
    modules: makeModules([
      {
        title: "Understanding the Analyst Role",
        description: "Clarify responsibilities, tools, and common career paths.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "Skill Stack Breakdown",
        description: "Map Excel, SQL, Python, BI tools, and portfolio needs.",
        video: videoLibrary.dataAnalyst,
        duration: "20 min",
        resources: []
      },
      {
        title: "Portfolio and Job Readiness",
        description: "Understand projects and evidence needed for hiring.",
        video: videoLibrary.dataAnalyst,
        duration: "18 min",
        resources: []
      },
      {
        title: "90-Day Learning Plan",
        description: "Translate the roadmap into a realistic study plan.",
        video: videoLibrary.dataAnalyst,
        duration: "22 min",
        resources: []
      }
    ])
  },
  {
    title: "Frontend Developer Career Starter",
    description: "Follow a guided path through HTML, CSS, JavaScript, React, and project building.",
    category: "Career",
    subcategory: "Career Path",
    level: "Beginner",
    duration: "2 weeks",
    amount: 699,
    instructor: "Aarav Kapoor",
    tags: ["frontend", "career", "roadmap"],
    overview: "A direction-setting course for learners planning a frontend developer path.",
    requirements: ["Interest in web development"],
    learningOutcomes: [
      "Understand frontend learning order",
      "Choose practical projects",
      "Build a better beginner roadmap",
      "Prepare for internships and junior roles"
    ],
    modules: makeModules([
      {
        title: "Frontend Path Overview",
        description: "Understand the progression from structure to interactivity to frameworks.",
        video: videoLibrary.htmlCss,
        duration: "16 min",
        resources: []
      },
      {
        title: "Core Skill Prioritization",
        description: "Learn what matters most early and what can wait.",
        video: videoLibrary.javascript,
        duration: "18 min",
        resources: []
      },
      {
        title: "Portfolio Strategy",
        description: "Choose beginner projects that show practical skill growth.",
        video: videoLibrary.react,
        duration: "18 min",
        resources: []
      },
      {
        title: "Study Plan and Next Steps",
        description: "Build a realistic study routine and progression roadmap.",
        video: videoLibrary.react,
        duration: "20 min",
        resources: []
      }
    ])
  },
  {
    title: "Generative AI for Beginners",
    description: "Understand practical uses of generative AI tools in content, coding, and workflows.",
    category: "Data & AI",
    subcategory: "Generative AI",
    level: "Beginner",
    duration: "3 weeks",
    amount: 1099,
    instructor: "Rohan Singh",
    tags: ["ai", "generative ai", "productivity"],
    overview: "A practical non-hype introduction to using generative AI productively and responsibly.",
    requirements: ["Basic comfort with online tools"],
    learningOutcomes: [
      "Understand key GenAI use cases",
      "Use AI tools more effectively",
      "Write more structured prompts",
      "Recognize practical limitations"
    ],
    modules: makeModules([
      {
        title: "What Generative AI Is",
        description: "Understand core concepts and practical everyday use cases.",
        video: videoLibrary.dataAnalyst,
        duration: "20 min",
        resources: []
      },
      {
        title: "Prompting for Better Output",
        description: "Write more structured and useful prompts for different tasks.",
        video: videoLibrary.dataAnalyst,
        duration: "22 min",
        resources: []
      },
      {
        title: "Use Cases for Learning and Work",
        description: "Apply AI tools to research, writing, coding, and productivity.",
        video: videoLibrary.dataAnalyst,
        duration: "22 min",
        resources: []
      },
      {
        title: "Responsible Usage Patterns",
        description: "Recognize limitations, validation needs, and privacy considerations.",
        video: videoLibrary.dataAnalyst,
        duration: "20 min",
        resources: []
      }
    ])
  }
];

const coursesSeed = courseBlueprints.slice(0, 50);

const seed = async () => {
  await connectDB();

  console.log("Clearing collections...");
  await Promise.all([
    Comment.deleteMany({}),
    Modules.deleteMany({}),
    Course.deleteMany({}),
    Progress.deleteMany({}),
    Enrollment.deleteMany({}),
    Order.deleteMany({}),
    User.deleteMany({})
  ]);

  console.log("Creating users...");
  const users = [];
  for (const user of usersSeed) {
    const hashed = await bcrypt.hash(user.password, 10);
    users.push(
      await User.create({
        fullName: user.fullName,
        email: user.email,
        password: hashed,
        admin: user.admin,
        profilePhoto:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=500&auto=format&fit=crop"
      })
    );
  }

  const instructors = users.filter((u) => u.admin);
  const students = users.filter((u) => !u.admin);

  console.log(`Creating ${coursesSeed.length} courses and modules...`);
  const createdCourses = [];

  for (let i = 0; i < coursesSeed.length; i++) {
    const seedCourse = coursesSeed[i];
    const owner = randomItem(instructors);

    const course = await Course.create({
      userId: owner._id,
      title: seedCourse.title,
      description: seedCourse.description,
      thumbnail: placeholderThumbs[i % placeholderThumbs.length],
      amount: seedCourse.amount,
      category: seedCourse.category,
      subcategory: seedCourse.subcategory,
      level: seedCourse.level,
      duration: seedCourse.duration,
      instructor: seedCourse.instructor,
      tags: seedCourse.tags,
      overview: seedCourse.overview,
      requirements: seedCourse.requirements,
      learningOutcomes: seedCourse.learningOutcomes,
      isPublished: true,
      modules: []
    });

    const moduleIds = [];

    for (const moduleSeed of seedCourse.modules) {
      const moduleDoc = await Modules.create({
        courseId: course._id,
        title: moduleSeed.title,
        description: moduleSeed.description,
        video: moduleSeed.video,
        order: moduleSeed.order,
        duration: moduleSeed.duration,
        isPreviewFree: moduleSeed.isPreviewFree,
        resources: moduleSeed.resources || [],
        comments: []
      });

      moduleIds.push(moduleDoc._id);
    }

    course.modules = moduleIds;
    await course.save();
    createdCourses.push(course);
  }

  console.log("Creating enrollments, orders, progress, comments...");
  for (const student of students) {
    const picked = createdCourses.slice(0, 4);
    const purchasedCourseIds = [];

    for (const course of picked) {
      purchasedCourseIds.push(course._id);

      await Enrollment.create({
        userId: student._id,
        courseId: course._id,
        stripeSessionId: `sess_${student._id.toString().slice(-6)}_${course._id
          .toString()
          .slice(-6)}`
      });

      await Order.create({
        user: student._id,
        course: course._id,
        totalAmount: course.amount,
        stripeSessionId: `pi_${student._id.toString().slice(-6)}_${course._id
          .toString()
          .slice(-6)}`
      });

      const modules = await Modules.find({ courseId: course._id }).sort({ order: 1 });

      for (let idx = 0; idx < modules.length; idx++) {
        const mod = modules[idx];
        const completed = idx < 2 ? Math.random() > 0.3 : Math.random() > 0.7;

        await Progress.create({
          user: student._id,
          course: course._id,
          module: mod._id,
          completed,
          completedAt: completed ? new Date() : null
        });

        if (Math.random() > 0.6) {
          const comment = await Comment.create({
            userId: student._id,
            moduleId: mod._id,
            comment: "Great lesson! Clear explanation and helpful pacing."
          });

          await Modules.findByIdAndUpdate(mod._id, {
            $push: { comments: comment._id }
          });
        }
      }
    }

    await User.findByIdAndUpdate(student._id, {
      purchasedCourse: purchasedCourseIds
    });
  }

  console.log("Seed completed.");
  await mongoose.connection.close();
};

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.connection.close();
  process.exit(1);
});