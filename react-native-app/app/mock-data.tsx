import { Question } from "@/lib/api/gameService";

// Mock questions for each category if API fails
export const MOCK_QUESTIONS: Record<string, Question[]> = {
  "Cyber Security": [
    {
      id: 1,
      question: "A friendly stranger in a work uniform is trying to get into your workplace building. They say that someone at the head office sent them, but they forgot their pass. What should you do?",
      category: "Cyber Security",
      options: [
        "Ask them to wait outside while a security guard verifies their story",
        "Ignore them and continue doing whatever you were doing before",
        "Let them in because their uniform looks legitimate and they're in a hurry",
        "Refuse entry and call local police to have them handle the situation"
      ],
      correct_answer: "Ask them to wait outside while a security guard verifies their story",
      hint: "Always verify identity before allowing access to secure areas."
    },
    {
      id: 2,
      question: "Your company's website experiences a sudden influx of traffic. At this time of day, the site usually receives a dozen or so visits. Instead, the site is receiving hundreds of connection requests. This traffic is causing the website to load very slowly if it loads at all. Which type of cyberattack might be occurring?",
      category: "Cyber Security",
      options: [
        "Denial-of-service (DoS) attack",
        "Structured query language (SQL) injection",
        "Man-in-the-middle (MitM) attack",
        "Spear phishing"
      ],
      correct_answer: "Denial-of-service (DoS) attack",
      hint: "This attack aims to make a service unavailable by overwhelming it with traffic."
    },
    {
      id: 3,
      question: "Imagine that you're using Zenmap to scan a host. What information about the host do you need to perform your scan?",
      category: "Cyber Security",
      options: [
        "Web address",
        "Operating system",
        "Server software",
        "Port number"
      ],
      correct_answer: "Web address",
      hint: "You need to know where to direct the scan."
    }
  ],
  "AI": [
    {
      id: 4,
      question: "What is machine learning?",
      category: "AI",
      options: [
        "A type of computer hardware",
        "The ability of computers to learn without explicit programming",
        "A programming language for AI",
        "The study of robot mechanics"
      ],
      correct_answer: "The ability of computers to learn without explicit programming",
      hint: "It's about algorithms that improve through experience."
    },
    {
      id: 5,
      question: "Which of the following is an example of supervised learning?",
      category: "AI",
      options: [
        "Clustering customer data without labels",
        "A recommendation system that learns user preferences over time",
        "Image classification with labeled training data",
        "Reinforcement learning in game playing"
      ],
      correct_answer: "Image classification with labeled training data",
      hint: "This type of learning uses labeled examples to train models."
    },
    {
      id: 6,
      question: "What is the primary function of neural networks in AI?",
      category: "AI",
      options: [
        "Data storage",
        "Pattern recognition and prediction",
        "Network security",
        "Hardware acceleration"
      ],
      correct_answer: "Pattern recognition and prediction",
      hint: "They're designed to recognize relationships in data."
    }
  ],
  "Data": [
    {
      id: 7,
      question: "What is the purpose of data normalization?",
      category: "Data",
      options: [
        "To increase the size of the dataset",
        "To eliminate duplicate records",
        "To scale features to a similar range",
        "To encrypt sensitive information"
      ],
      correct_answer: "To scale features to a similar range",
      hint: "It helps prevent certain features from dominating due to their scale."
    },
    {
      id: 8,
      question: "Which of these is a NoSQL database?",
      category: "Data",
      options: [
        "Oracle",
        "MySQL",
        "MongoDB",
        "PostgreSQL"
      ],
      correct_answer: "MongoDB",
      hint: "This database uses documents rather than tables and rows."
    },
    {
      id: 9,
      question: "What does ETL stand for in data management?",
      category: "Data",
      options: [
        "Extend, Transform, Load",
        "Extract, Transform, Load",
        "Evaluate, Test, Launch",
        "Enable, Transfer, Link"
      ],
      correct_answer: "Extract, Transform, Load",
      hint: "It's a process used to collect data from various sources and put it into a data warehouse."
    }
  ],
  "Cloud Computing": [
    {
      id: 10,
      question: "Which service model provides virtual machines on demand?",
      category: "Cloud Computing",
      options: [
        "Software as a Service (SaaS)",
        "Platform as a Service (PaaS)",
        "Infrastructure as a Service (IaaS)",
        "Function as a Service (FaaS)"
      ],
      correct_answer: "Infrastructure as a Service (IaaS)",
      hint: "This model provides the most basic cloud resources."
    },
    {
      id: 11,
      question: "What is the main benefit of cloud elasticity?",
      category: "Cloud Computing",
      options: [
        "Reduced security risks",
        "Ability to scale resources based on demand",
        "Enhanced data encryption",
        "Improved database performance"
      ],
      correct_answer: "Ability to scale resources based on demand",
      hint: "It allows for flexible resource allocation."
    },
    {
      id: 12,
      question: "Which of the following is NOT a major cloud service provider?",
      category: "Cloud Computing",
      options: [
        "Amazon Web Services (AWS)",
        "Microsoft Azure",
        "Google Cloud Platform",
        "Adobe Cloud Systems"
      ],
      correct_answer: "Adobe Cloud Systems",
      hint: "Three of these are the dominant providers in the industry."
    }
  ]
};

// Mock AI responses for topic introductions
export const MOCK_INTRODUCTIONS: Record<string, string> = {
  "Cyber Security": "Welcome to the Cyber Security round! In today's digital world, protecting data and systems from threats is more critical than ever. Let's see how well you understand the principles of keeping information safe!",
  
  "AI": "Welcome to the AI round! Artificial Intelligence is revolutionizing how we solve problems and interact with technology. Get ready to test your knowledge on machine learning, neural networks, and more!",
  
  "Data": "Welcome to the Data round! Data is the lifeblood of modern business and decision making. Let's explore your understanding of databases, analytics, and data management concepts!",
  
  "Cloud Computing": "Welcome to Cloud Computing! This technology has transformed how businesses deploy and scale their applications. Let's see what you know about services, deployment models, and cloud architecture!"
};

// Function to get mock questions when API fails
export const getMockQuestions = (category: string, count: number = 3): Question[] => {
  const questions = MOCK_QUESTIONS[category] || [];
  // Return all questions or up to the requested count
  return questions.slice(0, count);
};

// Function to get mock introduction when API fails
export const getMockIntroduction = (topic: string): string => {
  return MOCK_INTRODUCTIONS[topic] || 
    `Welcome to the ${topic} round! Let's test your knowledge and see how well you understand this exciting field!`;
};

// Add a default export with a simple component to satisfy Expo Router
export default function MockData() {
  return null;
}
