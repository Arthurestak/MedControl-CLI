import { useGetMedicationSummary, useListMedications, useMarkMedicationTaken, getListMedicationsQueryKey, getGetMedicationSummaryQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Check, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetMedicationSummary();
  const { data: medications, isLoading: isLoadingMeds } = useListMedications();
  const markTaken = useMarkMedicationTaken();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleToggleTaken = (id: number, currentlyTaken: boolean) => {
    markTaken.mutate(
      { id, data: { taken: !currentlyTaken } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMedicationsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMedicationSummaryQueryKey() });
          if (!currentlyTaken) {
            toast({
              title: "Marked as taken",
              description: "Great job staying on track!",
            });
          }
        }
      }
    );
  };

  const isLoading = isLoadingSummary || isLoadingMeds;

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header & Stats */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Good morning.</h1>
              <p className="text-muted-foreground mt-1 text-lg">Here is your schedule for today.</p>
            </div>
            <Button asChild className="rounded-full shadow-sm hover:shadow-md transition-all gap-2" size="lg">
              <Link href="/medications/new">
                <Plus className="w-5 h-5" />
                Add Medication
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <Card className="border-none shadow-md overflow-hidden rounded-3xl bg-primary/5">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-32 mb-4 bg-primary/10" />
                <Skeleton className="h-10 w-full mb-2 bg-primary/10" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 bg-primary/10" />
                  <Skeleton className="h-4 w-20 bg-primary/10" />
                </div>
              </CardContent>
            </Card>
          ) : summary ? (
            <Card className="border-none shadow-md overflow-hidden rounded-3xl bg-primary/5 relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Check className="w-32 h-32" />
              </div>
              <CardContent className="p-6 md:p-8 relative z-10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wider">Today's Progress</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">{summary.taken}</span>
                      <span className="text-xl text-muted-foreground font-medium">/ {summary.total}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">{Math.round(summary.takenPercent)}%</span>
                  </div>
                </div>
                
                <Progress value={summary.takenPercent} className="h-3 bg-primary/20" />
                
                <div className="flex justify-between mt-4 text-sm font-medium text-muted-foreground">
                  <span>{summary.taken} taken</span>
                  <span>{summary.pending} pending</span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </section>

        {/* Medication List */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Today's Medications</h2>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : !medications || medications.length === 0 ? (
            <div className="text-center py-16 px-4 bg-muted/30 rounded-3xl border border-dashed border-border/60">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No medications scheduled</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Add your first medication to start tracking your daily routine.
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/medications/new">Add Medication</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {medications.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)).map((med) => (
                <div 
                  key={med.id} 
                  className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${
                    med.taken 
                      ? 'bg-muted/30 border-transparent opacity-75 grayscale-[30%]' 
                      : 'bg-card border-card-border shadow-sm hover:shadow-md'
                  }`}
                >
                  <Link href={`/medications/${med.id}`} className="flex-1 flex items-start gap-4">
                    <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
                      med.taken ? 'bg-primary/10 text-primary/50' : 'bg-secondary/10 text-secondary'
                    }`}>
                      {med.scheduledTime}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg transition-colors ${med.taken ? 'text-muted-foreground line-through decoration-muted-foreground/30' : 'text-foreground'}`}>
                        {med.name}
                      </h3>
                      {med.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          {med.notes}
                        </p>
                      )}
                    </div>
                  </Link>

                  <Button
                    variant={med.taken ? "outline" : "default"}
                    size="icon"
                    className={`shrink-0 w-12 h-12 rounded-full ml-4 transition-all duration-300 ${
                      med.taken ? 'text-primary border-primary/20 hover:bg-primary/5' : 'shadow-sm hover:shadow-md hover:scale-105'
                    }`}
                    onClick={() => handleToggleTaken(med.id, med.taken)}
                    disabled={markTaken.isPending}
                    data-testid={`btn-toggle-taken-${med.id}`}
                  >
                    {med.taken ? <Check className="w-6 h-6" /> : <div className="w-5 h-5 rounded-full border-2 border-primary-foreground" />}
                    <span className="sr-only">Mark {med.taken ? 'pending' : 'taken'}</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

// Needed for the empty state icon
import { Pill } from "lucide-react";
