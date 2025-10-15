"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function SeedDatabase() {
  const seedData = useMutation(api.seedData.seedDatabase);

  const handleSeed = async () => {
    try {
      const result = await seedData();
      toast.success("Database seeded successfully!");
      console.log("Seed result:", result);
    } catch (error) {
      toast.error("Failed to seed database: " + error.message);
      console.error("Seed error:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="default" 
        onClick={handleSeed}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Seed Database
      </Button>
    </div>
  );
}