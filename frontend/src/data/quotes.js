export const QUOTES = [
  {
    quote: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King"
  },
  {
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert"
  },
  {
    quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin"
  },
  {
    quote: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch"
  },
  {
    quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X"
  },
  {
    quote: "Real knowledge is to know the extent of one's ignorance.",
    author: "Confucius"
  },
  {
    quote: "It is not that I'm so smart, it's just that I stay with problems longer.",
    author: "Albert Einstein"
  },
  {
    quote: "Success is no accident. It is hard work, perseverance, learning, studying, and sacrifice.",
    author: "Pelé"
  },
  {
    quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    quote: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
    author: "Albert Einstein"
  },
  {
    quote: "Change is the end result of all true learning.",
    author: "Leo Buscaglia"
  },
  {
    quote: "Develop a passion for learning. If you do, you will never cease to grow.",
    author: "Anthony J. D'Angelo"
  },
  {
    quote: "Knowledge is power. Information is liberating. Education is the premise of progress.",
    author: "Kofi Annan"
  },
  {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra"
  },
  {
    quote: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    quote: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    quote: "Continuous learning is the minimum requirement for success in any field.",
    author: "Brian Tracy"
  },
  {
    quote: "Never stop learning, because life never stops teaching.",
    author: "Anonymous"
  },
  {
    quote: "Curiosity is the wick in the candle of learning.",
    author: "William Arthur Ward"
  },
  {
    quote: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates"
  },
  {
    quote: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  },
  {
    quote: "Patience, persistence and perspiration make an unbeatable combination for success.",
    author: "Napoleon Hill"
  }
];

/**
 * Calculates the current 30-minute block quote index.
 * Rotates to the next quote precisely every 30 minutes.
 */
export function getCurrent30MinQuoteIndex(totalQuotes) {
  const THIRTY_MINUTES_MS = 30 * 60 * 1000;
  const timeBlock = Math.floor(Date.now() / THIRTY_MINUTES_MS);
  return timeBlock % totalQuotes;
}
