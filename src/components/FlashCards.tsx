import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

interface FlashCard {
  question: string;
  answer: string;
}

interface FlashCardsProps {
  cards: FlashCard[];
  onClose: () => void;
}

const FlashCards = ({ cards, onClose }: FlashCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Flashcards</h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </div>

        <div
          className="relative h-96 cursor-pointer perspective-1000"
          onClick={handleFlip}
        >
          <div
            className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of card */}
            <Card
              className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-secondary/10 ${
                isFlipped ? 'invisible' : 'visible'
              }`}
            >
              <div className="text-sm text-muted-foreground mb-4">Question</div>
              <div className="text-xl md:text-2xl font-semibold text-center prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {currentCard.question}
                </ReactMarkdown>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCw className="w-4 h-4" />
                Click to reveal answer
              </div>
            </Card>

            {/* Back of card */}
            <Card
              className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-secondary/10 to-primary/10 ${
                !isFlipped ? 'invisible' : 'visible'
              }`}
            >
              <div className="text-sm text-muted-foreground mb-4">Answer</div>
              <div className="text-lg md:text-xl text-center prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {currentCard.answer}
                </ReactMarkdown>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCw className="w-4 h-4" />
                Click to see question
              </div>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <div className="flex gap-2">
            {cards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashCards;
