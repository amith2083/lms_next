// app/(somepath)/_components/SkeletonCourseCard.tsx
export default function SkeletonCourseCard() {
  return (
    <div className="p-4 border rounded-md animate-pulse space-y-3 bg-gray-100">
      <div className="h-40 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  );
}
