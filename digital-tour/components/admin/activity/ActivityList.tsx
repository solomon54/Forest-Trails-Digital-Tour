import { Activity } from "./activity.types";
import ActivityCard from "./ActivityCard";

interface Props {
  activities: Activity[];
}

export default function ActivityList({ activities }: Props) {
  if (!activities.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2">
        <p className="text-gray-500">No activities found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {activities.slice(0, 10).map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
