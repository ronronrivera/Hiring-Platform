function JobPreviewCard({
  title,
  company,
  status,
}: {
  title: string
  company: string
  status: "Applied" | "Interview" | "Rejected"
}) {
  const statusColor =
    status === "Interview"
      ? "text-green-600"
      : status === "Rejected"
      ? "text-red-500"
      : "text-yellow-600"

  return (
    <div className="flex items-center justify-between rounded-xl border px-4 py-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{company}</p>
      </div>
      <span className={`text-sm font-semibold ${statusColor}`}>
        {status}
      </span>
    </div>
  )
}

export default JobPreviewCard;
