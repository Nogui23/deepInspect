import { motion } from "framer-motion";

export function IntroAnimation({ onComplete }){
    const rectangles = [0, 1, 2, 3, 4, 5];
    
    return (
        <div className="fixed inset-0 flex flex-col w-full h-full z-50 pointer-events-none">
        {rectangles.map((i) => (
            <motion.div
            key={i}
            className="absolute top-0 left-0 w-full h-1/6 bg-black border-2 border-l-0 border-white"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ delay: i * 0.2, duration: 0.5, ease: "easeInOut" }}
            onAnimationComplete={i === 5 ? onComplete : undefined}
            style={{ top: `${(i * 100) / 6}%` }}
            />
        ))}
        </div>
    );
};

export function ExitAnimation({ onComplete }) {
    const rectangles = [0, 1, 2, 3, 4, 5];
  
    return (
        <div className="fixed inset-0 flex flex-col w-full h-full z-50 pointer-events-none">
            {rectangles.map((i) => (
                <motion.div
                key={i}
                className="absolute top-0 left-0 w-full h-1/6 bg-black border-2 border-r-0 border-white"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{ delay: i * 0.2, duration: 0.5, ease: "easeInOut" }}
                style={{ top: `${(i * 100) / 6}%` }}
                />
            ))}
        </div>
    );
  };
  