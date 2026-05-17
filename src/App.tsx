import { useState } from "react";
import "./App.css";

const colors = {
  bg: "#0F172A", surface: "#1E293B", surface2: "#293548",
  border: "#334155", teal: "#0D9488", tealLight: "#14B8A6",
  red: "#EF4444", amber: "#F59E0B", green: "#22C55E",
  text: "#F1F5F9", textMuted: "#94A3B8", textDim: "#64748B",
};

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCurrency(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const number = parseInt(digits) / 100;
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Priority = "alta" | "media" | "baixa" | "";

type FormData = {
  name: string; email: string; phone: string;
  role: string; company: string;
  title: string; value: string; probability: number;
  closeDate: string; priority: Priority; notes: string;
  owner: string; products: string[]; bant: string[];
  tags: string[]; tagInput: string; score: number;
};

type Errors = Partial<Record<keyof FormData | "products", string>>;

const owners = [
  { id: "1", name: "Ana Costa" },
  { id: "2", name: "Bruno Silva" },
  { id: "3", name: "Carla Matos" },
  { id: "4", name: "Diego Ferreira" },
];

const productOptions = [
  "Plano Starter", "Plano Pro", "Plano Enterprise",
  "Implementação", "Consultoria",
];

const bantItems = [
  "Budget confirmado", "Autoridade identificada",
  "Necessidade mapeada", "Prazo definido",
];

const emptyForm: FormData = {
  name: "", email: "", phone: "", role: "", company: "",
  title: "", value: "", probability: 50, closeDate: "",
  priority: "", notes: "", owner: "", products: [],
  bant: [], tags: [], tagInput: "", score: 0,
};

export default function App() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  function validate(): Errors {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    if (!form.email.includes("@") || !form.email.includes("."))
      e.email = "Email inválido";
    if (form.phone && form.phone.replace(/\D/g, "").length < 10)
      e.phone = "Telefone incompleto";
    if (!form.title.trim()) e.title = "Título é obrigatório";
    if (!form.priority) e.priority = "Selecione uma prioridade";
    if (form.products.length === 0)
      e.products = "Selecione ao menos um produto";
    if (form.closeDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(form.closeDate) < today)
        e.closeDate = "A data não pode ser no passado";
    }
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
  }

  function setField<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function toggleProduct(p: string) {
    const next = form.products.includes(p)
      ? form.products.filter(x => x !== p)
      : [...form.products, p];
    setForm(prev => ({ ...prev, products: next }));
    setErrors(prev => ({ ...prev, products: undefined }));
  }

  function toggleBant(b: string) {
    const next = form.bant.includes(b)
      ? form.bant.filter(x => x !== b)
      : [...form.bant, b];
    setForm(prev => ({ ...prev, bant: next }));
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && form.tagInput.trim()) {
      e.preventDefault();
      const tag = form.tagInput.trim().toLowerCase();
      if (!form.tags.includes(tag))
        setForm(prev => ({ ...prev, tags: [...prev.tags, tag], tagInput: "" }));
    }
  }

  function removeTag(tag: string) {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }

  if (submitted) {
    return (
      <div className="success-screen">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Lead cadastrado com sucesso!</h2>
          <p><b>Nome:</b> {form.name}</p>
          <p><b>Empresa:</b> {form.company || "—"}</p>
          <p><b>Oportunidade:</b> {form.title}</p>
          <p><b>Valor:</b> {form.value || "—"}</p>
          <p><b>Prioridade:</b> {form.priority}</p>
          <button onClick={() => { setSubmitted(false); setForm(emptyForm); setErrors({}); }}>
            Novo cadastro
          </button>
        </div>
      </div>
    );
  }

  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    display: "block", width: "100%", padding: "9px 12px",
    background: colors.surface2, border: `1px solid ${colors.border}`,
    borderRadius: 6, color: colors.text, fontSize: 14,
    boxSizing: "border-box", outline: "none", fontFamily: "inherit",
    ...extra,
  });

  const lbl: React.CSSProperties = {
    display: "block", fontSize: 11, color: colors.textMuted,
    marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em",
    fontWeight: 600,
  };

  const secTitle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: colors.textDim,
    textTransform: "uppercase", letterSpacing: "0.09em",
    borderBottom: `1px solid ${colors.border}`, paddingBottom: 8,
    margin: "0 0 18px 0",
  };

  const err: React.CSSProperties = { color: colors.red, fontSize: 11, marginTop: 3 };

  const bantScore = form.bant.length;

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 3 }}>
            CRM &rsaquo; Leads &rsaquo;{" "}
            <span style={{ color: colors.text }}>Nova Oportunidade</span>
          </div>
          <h1 style={{ color: colors.text, fontSize: 18, margin: 0, fontWeight: 600 }}>
            Nova Oportunidade
          </h1>
        </div>
        <span style={{ background: "#1E3A5F", color: "#60A5FA", fontSize: 11, padding: "3px 12px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.05em" }}>
          RASCUNHO
        </span>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Left column */}
        <div style={{ flex: "0 0 62%", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Dados do Contato */}
          <div style={{ background: colors.surface, borderRadius: 10, border: `1px solid ${colors.border}`, padding: 24 }}>
            <p style={secTitle}>Dados do Contato</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={lbl}>Nome completo *</label>
                <input style={inp({ borderColor: errors.name ? colors.red : colors.border })}
                  value={form.name} placeholder="Ex: Maria Oliveira"
                  onChange={e => setField("name", e.target.value)} />
                {errors.name && <p style={err}>{errors.name}</p>}
              </div>
              <div>
                <label style={lbl}>Email *</label>
                <input style={inp({ borderColor: errors.email ? colors.red : colors.border })}
                  value={form.email} placeholder="maria@empresa.com"
                  onChange={e => setField("email", e.target.value)} />
                {errors.email && <p style={err}>{errors.email}</p>}
              </div>
              <div>
                <label style={lbl}>Telefone</label>
                <input style={inp({ borderColor: errors.phone ? colors.red : colors.border })}
                  value={form.phone} placeholder="(31) 99999-9999"
                  onChange={e => setField("phone", maskPhone(e.target.value))} />
                {errors.phone && <p style={err}>{errors.phone}</p>}
              </div>
              <div>
                <label style={lbl}>Cargo</label>
                <input style={inp()} value={form.role} placeholder="Ex: Diretor Comercial"
                  onChange={e => setField("role", e.target.value)} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Empresa</label>
                <input style={inp()} value={form.company} placeholder="Nome da empresa"
                  onChange={e => setField("company", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Dados da Oportunidade */}
          <div style={{ background: colors.surface, borderRadius: 10, border: `1px solid ${colors.border}`, padding: 24 }}>
            <p style={secTitle}>Dados da Oportunidade</p>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Título da oportunidade *</label>
              <input style={inp({ borderColor: errors.title ? colors.red : colors.border })}
                value={form.title} placeholder="Ex: Expansão de contrato — Plano Enterprise"
                onChange={e => setField("title", e.target.value)} />
              {errors.title && <p style={err}>{errors.title}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={lbl}>Valor estimado</label>
                <input style={inp()} value={form.value} placeholder="R$ 0,00"
                  onChange={e => setField("value", maskCurrency(e.target.value))} />
              </div>
              <div>
                <label style={lbl}>Data prevista de fechamento</label>
                <input type="date" style={inp({ borderColor: errors.closeDate ? colors.red : colors.border, colorScheme: "dark" })}
                  value={form.closeDate}
                  onChange={e => setField("closeDate", e.target.value)} />
                {errors.closeDate && <p style={err}>{errors.closeDate}</p>}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={lbl}>
                Probabilidade de fechamento:{" "}
                <span style={{ color: colors.tealLight, fontWeight: 700 }}>{form.probability}%</span>
              </label>
              <input type="range" min={0} max={100} step={5}
                value={form.probability}
                onChange={e => setField("probability", Number(e.target.value))}
                style={{ width: "100%", accentColor: colors.teal, marginBottom: 4 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: colors.textDim }}>
                <span>Improvável</span><span>50%</span><span>Muito provável</span>
              </div>
            </div>
            <div>
              <label style={{ ...lbl, marginBottom: 10 }}>Prioridade *</label>
              <div style={{ display: "flex", gap: 10 }}>
                {([
                  { value: "alta", label: "Alta", color: colors.red },
                  { value: "media", label: "Média", color: colors.amber },
                  { value: "baixa", label: "Baixa", color: colors.green },
                ] as const).map(opt => (
                  <label key={opt.value} style={{
                    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                    background: form.priority === opt.value ? colors.surface2 : "transparent",
                    border: `1px solid ${form.priority === opt.value ? opt.color : colors.border}`,
                    borderRadius: 6, padding: "8px 16px", flex: 1, justifyContent: "center",
                  }}>
                    <input type="radio" name="priority" value={opt.value}
                      checked={form.priority === opt.value}
                      onChange={() => setField("priority", opt.value)}
                      style={{ accentColor: opt.color }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: form.priority === opt.value ? opt.color : colors.textMuted }}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.priority && <p style={err}>{errors.priority}</p>}
            </div>
          </div>

          {/* Observações */}
          <div style={{ background: colors.surface, borderRadius: 10, border: `1px solid ${colors.border}`, padding: 24 }}>
            <p style={secTitle}>Observações</p>
            <textarea value={form.notes} maxLength={500}
              onChange={e => setField("notes", e.target.value)}
              placeholder="Contexto sobre o lead, histórico de contato, objeções identificadas..."
              style={{ ...inp(), height: 96, resize: "vertical" }} />
            <div style={{ textAlign: "right", fontSize: 11, color: colors.textDim, marginTop: 4 }}>
              {form.notes.length}/500
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Responsável */}
          <div style={{ background: colors.surface, borderRadius: 8, border: `1px solid ${colors.border}`, padding: 16 }}>
            <p style={secTitle}>Responsável</p>
            <select value={form.owner} onChange={e => setField("owner", e.target.value)} style={inp()}>
              <option value="">Selecione o responsável</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>

          {/* Produtos */}
          <div style={{ background: colors.surface, borderRadius: 8, border: `1px solid ${colors.border}`, padding: 16 }}>
            <p style={secTitle}>Produto / Serviço *</p>
            {productOptions.map(p => (
              <label key={p} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, cursor: "pointer" }}>
                <input type="checkbox" checked={form.products.includes(p)}
                  onChange={() => toggleProduct(p)}
                  style={{ accentColor: colors.teal, width: 15, height: 15 }} />
                <span style={{ fontSize: 13, color: colors.text }}>{p}</span>
              </label>
            ))}
            {errors.products && <p style={err}>{errors.products}</p>}
          </div>

          {/* BANT */}
          <div style={{ background: colors.surface, borderRadius: 8, border: `1px solid ${colors.border}`, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ ...secTitle, margin: 0, border: "none", padding: 0 }}>Qualificação BANT</p>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 12,
                background: bantScore === 4 ? "#14532D" : bantScore >= 2 ? "#713F12" : "#450A0A",
                color: bantScore === 4 ? "#4ADE80" : bantScore >= 2 ? "#FCD34D" : "#FCA5A5",
              }}>
                {bantScore}/4
              </span>
            </div>
            {bantItems.map(b => (
              <label key={b} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, cursor: "pointer" }}>
                <input type="checkbox" checked={form.bant.includes(b)}
                  onChange={() => toggleBant(b)}
                  style={{ accentColor: colors.teal, width: 15, height: 15 }} />
                <span style={{ fontSize: 13, color: form.bant.includes(b) ? colors.text : colors.textMuted }}>
                  {b}
                </span>
              </label>
            ))}
          </div>

          {/* Score */}
          <div style={{ background: colors.surface, borderRadius: 8, border: `1px solid ${colors.border}`, padding: 16 }}>
            <p style={secTitle}>Score do Lead</p>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star}
                  style={{ fontSize: 28, cursor: "pointer", transition: "color 0.1s", color: star <= (hoveredStar || form.score) ? "#FBBF24" : colors.border }}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setField("score", star)}>★</span>
              ))}
            </div>
            <p style={{ fontSize: 11, color: colors.textDim, marginTop: 6, marginBottom: 0 }}>
              {form.score === 0 ? "Não avaliado" : form.score <= 2 ? "Lead frio" : form.score === 3 ? "Lead morno" : "Lead quente"}
            </p>
          </div>

          {/* Tags */}
          <div style={{ background: colors.surface, borderRadius: 8, border: `1px solid ${colors.border}`, padding: 16 }}>
            <p style={secTitle}>Tags</p>
            <input value={form.tagInput}
              onChange={e => setForm(prev => ({ ...prev, tagInput: e.target.value }))}
              onKeyDown={addTag}
              placeholder="Digite e pressione Enter"
              style={inp()} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {form.tags.map(tag => (
                <span key={tag} style={{ background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 12, color: colors.text, display: "flex", alignItems: "center", gap: 4 }}>
                  {tag}
                  <button onClick={() => removeTag(tag)} style={{ background: "none", border: "none", color: colors.textMuted, cursor: "pointer", padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: "sticky", bottom: 0, background: colors.surface, borderTop: `1px solid ${colors.border}`, padding: "14px 32px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={() => { setForm(emptyForm); setErrors({}); }}
          style={{ background: "transparent", color: colors.textMuted, border: `1px solid ${colors.border}`, padding: "9px 20px", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>
          Cancelar
        </button>
        <button onClick={() => alert("Rascunho salvo!")}
          style={{ background: "transparent", color: colors.tealLight, border: `1px solid ${colors.teal}`, padding: "9px 20px", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>
          Salvar rascunho
        </button>
        <button onClick={handleSubmit}
          style={{ background: colors.teal, color: "white", border: "none", padding: "9px 24px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
          Cadastrar Lead →
        </button>
      </div>
    </div>
  );
}