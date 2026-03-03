export default function MealDetailPage({ params }) {
  const { mealSlug } = params;
  return (
    <div>
      <h1>Meal Detail Page for {mealSlug}</h1>
    </div>
  );
}
