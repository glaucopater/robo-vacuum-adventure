import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { GameConfig, DEFAULT_CONFIG } from "@/types/config";

const Config = () => {
  const form = useForm<GameConfig>({
    defaultValues: DEFAULT_CONFIG
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('gameConfig');
    if (savedConfig) {
      form.reset(JSON.parse(savedConfig));
    }
  }, []);

  const onSubmit = (data: GameConfig) => {
    localStorage.setItem('gameConfig', JSON.stringify(data));
    toast.success("Configuration saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Game Configuration
        </h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="gridSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grid Size</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="batteryMoveCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Battery Move Cost</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="batteryChargeRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Battery Charge Rate</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sunMoveInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sun Move Interval (ms)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Save Configuration</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Config;