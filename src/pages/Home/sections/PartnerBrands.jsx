import "./PartnerBrands.css";

/* Logolarni keyin rasm bilan almashtirasan */
const brands = [
  "Knauf",
  "Weber",
  "Akfa",
  "Artel",
  "Basalt Wool",
  "Eurocement",
  "Bekabad Cement",
  "Grand",
  "Imkon",
  "Orient Group",
];

function PartnerBrands() {
  return (
    <section className="partnersV3">
      <div className="container">
        <div className="partnersHead">
          <h2>Ishonchli hamkorlar</h2>
          <p>
            IMOR platformasida yuzlab sotuvchilar va yirik brendlar faol.
          </p>
        </div>

        <div className="partnersTrack">
          <div className="partnersRow">
            {brands.concat(brands).map((name, i) => (
              <div className="partnerLogo" key={i}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnerBrands;
