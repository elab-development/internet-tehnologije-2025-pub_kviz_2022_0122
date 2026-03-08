type Field = {
  label: string;
  value: React.ReactNode;
  icon?: string;
};

type InfoCardProps = {
  title: string;
  fields: Field[];
  action?: React.ReactNode;
  variant?: "default" | "user-profile";
};

export default function InfoCard({
  title,
  fields,
  action,
  variant = "default",
}: InfoCardProps) {
  if (variant === "user-profile") {
    return (
      <div className="bg-linear-to-br from-white to-orange-50 border-2 border-pub-orange shadow-xl rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-pub-orange rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {title.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black">{title}</h3>
            <p className="text-sm text-gray-600">Profil korisnika</p>
          </div>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-white/70 rounded-lg border border-pub-orange/30 hover:border-pub-orange transition-colors"
            >
              {field.icon && (
                <span className="text-2xl mt-0.5">{field.icon}</span>
              )}
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                <p className="text-black font-semibold">{field.value ?? "—"}</p>
              </div>
            </div>
          ))}
        </div>

        {action && (
          <div className="mt-6 pt-4 border-t border-gray-200">{action}</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-white/90 to-white/70 backdrop-blur-sm border-2 border-pub-orange/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-pub-orange transition-all duration-300 w-full max-w-sm">
      <h3 className="text-xl font-bold text-pub-blue mb-4 pb-2 border-b-2 border-pub-orange/30">
        {title}
      </h3>

      <div className="space-y-2.5">
        {fields.map((field, index) => (
          <div key={index} className="flex justify-between items-start gap-2">
            <span className="text-sm font-semibold text-gray-600 min-w-fit">
              {field.label}:
            </span>
            <span className="text-sm text-black font-medium text-right">
              {field.value ?? "—"}
            </span>
          </div>
        ))}
      </div>

      {action && (
        <div className="mt-5 pt-4 border-t border-gray-200">{action}</div>
      )}
    </div>
  );
}
