import { Link } from "react-router-dom";
import { Users, Wrench, PenTool, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "I&C Engineers",
    description:
      "Certified inspection and commissioning specialists, verified credentials and field track records.",
    features: ["Certified Engineers", "Compliance Testing", "Documentation"],
  },
  {
    icon: Wrench,
    title: "Tool Provision",
    description:
      "Rent or procure specialized testing equipment and monitoring software from verified vendors.",
    features: ["Testing Equipment", "Monitoring Software", "Rental Options"],
  },
  {
    icon: PenTool,
    title: "Design & O&M",
    description:
      "System layout, electrical schematics, permit drawings and long-term maintenance partners.",
    features: ["Electrical Design", "Permit Drawings", "Performance Analysis"],
  },
];

export const Services = () => {
  return (
    <section className="border-t border-border bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-start gap-12 md:grid-cols-3">
          {/* Intro column */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight text-foreground">
              Designed for the
              <br />
              Solar Workforce
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              A verticalized platform built specifically for the complexities of industrial and
              commercial solar installation.
            </p>
            <div className="pt-4">
              <Link
                to="/find-services"
                className="group flex items-center gap-2 text-sm font-bold text-primary transition-all hover:gap-3"
              >
                Explore Ecosystem
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Cards span the remaining columns */}
          <div className="grid gap-8 sm:grid-cols-2 md:col-span-2">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group animate-fade-in rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{service.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
