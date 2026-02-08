type Field = {
  label: string;
  value: React.ReactNode;
};

type InfoCardProps = {
  title: string;
  fields: Field[];
  action?: React.ReactNode;
};

export default function InfoCard({ title, fields, action }: InfoCardProps) {
  return (
    <div className="bg-white/60 w-70 p-4 shadow border flex flex-col items-center border-pub-blue">
      <h3 className="text-xl text-pub-blue font-semibold mb-2">{title}</h3>

      <div className="text-sm text-pub-blue space-y-1">
        {fields.map((field, index) => (
          <p key={index}>
            <span className="font-semibold">{field.label}: </span>
            {field.value ?? "—"}
          </p>
        ))}
      </div>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}