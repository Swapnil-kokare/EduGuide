import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Star, MessageSquareHeart } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { submitFeedback } from "@/lib/apiService";

const Feedback = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({ title: "Please enter your feedback", variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitFeedback({
        rating,
        message: message.trim(),
      });

      if (response.success) {
        toast({ title: "Thank you! 🎉", description: "Your feedback has been submitted successfully." });
        setName("");
        setMessage("");
        setRating(0);
      } else {
        toast({ title: "Something went wrong", description: response.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to submit feedback", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16">
      <div className="container max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-medium text-primary mb-4">
            <MessageSquareHeart className="h-4 w-4" />
            Your Feedback Matters
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Share Your Experience
          </h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Help us improve EduGuide by telling us what you think. Every response matters!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="glass">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Your Name (optional)</label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 transition-colors"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${star <= rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground/30"
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Your Feedback</label>
                  <Textarea
                    placeholder="Share your experience with EduGuide..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    maxLength={1000}
                  />
                </div>

                <Button type="submit" className="w-full gap-2 rounded-xl h-11" disabled={submitting}>
                  <Send className="h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;
