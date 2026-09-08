import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container pt-44">
      <div className="grid gap-16 lg:grid-cols-2">
        <div className="space-y-5">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-40 rounded-full" />
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>
        </div>
        <Skeleton className="aspect-square w-full max-w-md rounded-3xl" />
      </div>
      <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
