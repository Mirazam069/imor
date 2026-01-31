import { useMemo, useRef, useState } from "react";
import { uploadImage, removeImage } from "../../api/uploads.api";
import { resolveBackendUrl } from "../../config/env";
import "./ImageUploader.css";

export default function ImageUploader({
  value, // string (url or "/uploads/..")
  onChange,
  label = "Rasm",
  hint = "JPG/PNG/WebP (4MB gacha)",
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const has = !!value;

  const preview = useMemo(() => {
    if (!value) return "";
    return resolveBackendUrl(value); // ✅ "/uploads/x" -> "https://.../uploads/x"
  }, [value]);

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr("");
    try {
      setBusy(true);
      const res = await uploadImage(file);
      onChange?.(res.url); // saqlanadigan qiymat: "/uploads/xxx.jpg"
    } catch (er) {
      setErr(er?.message || "Upload xatosi.");
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    setErr("");
    try {
      setBusy(true);
      await removeImage();
      onChange?.("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (er) {
      setErr(er?.message || "O‘chirish xatosi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="iu-wrap">
      <div className="iu-top">
        <div className="iu-label">{label}</div>
        <div className="iu-hint">{hint}</div>
      </div>

      <div className={`iu-box ${has ? "has" : ""}`}>
        {has ? (
          <img className="iu-img" src={preview} alt="preview" />
        ) : (
          <div className="iu-empty">
            <ion-icon name="image-outline"></ion-icon>
            <div className="iu-emptyText">Rasm tanlanmagan</div>
          </div>
        )}

        <div className="iu-actions">
          <input
            ref={inputRef}
            className="iu-input"
            type="file"
            accept="image/*"
            onChange={onPick}
            disabled={busy}
          />

          <button
            className="iu-btn"
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <ion-icon name="cloud-upload-outline"></ion-icon>
            {busy ? "Yuklanmoqda..." : "Rasm tanlash"}
          </button>

          <button
            className="iu-btn ghost"
            type="button"
            onClick={onRemove}
            disabled={busy || !has}
          >
            <ion-icon name="trash-outline"></ion-icon>
            O‘chirish
          </button>
        </div>
      </div>

      {err ? (
        <div className="iu-error" role="alert">
          <ion-icon name="alert-circle-outline"></ion-icon>
          <span>{err}</span>
        </div>
      ) : null}
    </div>
  );
}
