/* ==========================================================
   Karina Oliveira — shared site behaviour
   ========================================================== */
(function(){
  "use strict";

  var LANGS = ["en","pt","es"];
  var LANG_LABELS = { en:"English", pt:"Português", es:"Español" };

  function detectDefaultLang(){
    var saved = null;
    try{ saved = localStorage.getItem("ko_lang"); }catch(e){}
    if(saved && LANGS.indexOf(saved) !== -1) return saved;

    var params = new URLSearchParams(window.location.search);
    var q = params.get("lang");
    if(q && LANGS.indexOf(q) !== -1) return q;

    var nav = (navigator.language || "en").toLowerCase();
    if(nav.indexOf("pt") === 0) return "pt";
    if(nav.indexOf("es") === 0) return "es";
    return "en";
  }

  var currentLang = detectDefaultLang();

  function t(key){
    var dict = I18N[currentLang] || I18N.en;
    return (key in dict) ? dict[key] : (I18N.en[key] || "");
  }

  function waLink(msgKey, extra){
    var msg = t(msgKey);
    if(extra) msg += " " + extra;
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  function applyTranslations(){
    document.documentElement.setAttribute("lang", currentLang);
    document.title = t("meta_title");

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      if(val) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      var key = el.getAttribute("data-i18n-ph");
      var val = t(key);
      if(val) el.setAttribute("placeholder", val);
    });

    document.querySelectorAll("[data-i18n-wa]").forEach(function(el){
      var key = el.getAttribute("data-i18n-wa");
      el.setAttribute("href", waLink(key));
    });

    document.querySelectorAll("[data-lang-option]").forEach(function(el){
      var lg = el.getAttribute("data-lang-option");
      el.classList.toggle("active", lg === currentLang);
    });

    document.querySelectorAll("[data-lang-current]").forEach(function(el){
      el.textContent = currentLang.toUpperCase();
    });
  }

  function setLang(lang){
    if(LANGS.indexOf(lang) === -1) return;
    currentLang = lang;
    try{ localStorage.setItem("ko_lang", lang); }catch(e){}
    applyTranslations();
  }

  window.KO = { t: t, waLink: waLink, setLang: setLang, getLang: function(){ return currentLang; } };

  document.addEventListener("DOMContentLoaded", function(){
    applyTranslations();

    /* ---------- language dropdown ---------- */
    document.querySelectorAll(".lang-switch").forEach(function(box){
      var btn = box.querySelector(".lang-btn");
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        document.querySelectorAll(".lang-switch").forEach(function(b){ if(b!==box) b.classList.remove("open"); });
        box.classList.toggle("open");
      });
      box.querySelectorAll("[data-lang-option]").forEach(function(opt){
        opt.addEventListener("click", function(){
          setLang(opt.getAttribute("data-lang-option"));
          box.classList.remove("open");
        });
      });
    });
    document.addEventListener("click", function(){
      document.querySelectorAll(".lang-switch.open").forEach(function(b){ b.classList.remove("open"); });
    });

    /* ---------- nav scroll state ---------- */
    var nav = document.querySelector("header.nav");
    if(nav){
      var onScroll = function(){
        if(window.scrollY > 40) nav.classList.add("solid");
        else nav.classList.remove("solid");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive:true });
    }

    /* ---------- mobile menu ---------- */
    var burger = document.querySelector(".burger");
    var panel = document.querySelector(".mobile-panel");
    if(burger && panel){
      burger.addEventListener("click", function(){
        panel.classList.toggle("open");
      });
      panel.querySelectorAll("a").forEach(function(a){
        a.addEventListener("click", function(){ panel.classList.remove("open"); });
      });
    }

    /* ---------- reveal on scroll ---------- */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if("IntersectionObserver" in window && revealEls.length){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold:.14 });
      revealEls.forEach(function(el){ io.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add("in"); });
    }

    /* ---------- case tabs ---------- */
    var tabs = document.querySelectorAll(".case-tab");
    var panels = document.querySelectorAll(".case-panel");
    tabs.forEach(function(tab){
      tab.addEventListener("click", function(){
        var target = tab.getAttribute("data-tab");
        tabs.forEach(function(x){ x.classList.remove("active"); });
        panels.forEach(function(p){ p.classList.remove("active"); });
        tab.classList.add("active");
        var panel = document.querySelector('.case-panel[data-panel="'+target+'"]');
        if(panel) panel.classList.add("active");
      });
    });

    /* ---------- footer year ---------- */
    document.querySelectorAll("[data-year]").forEach(function(el){
      el.textContent = new Date().getFullYear();
    });

    /* ---------- forms (Web3Forms) ---------- */
    document.querySelectorAll("form[data-web3form]").forEach(function(form){
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var submitBtn = form.querySelector("[data-submit-btn]");
        var errorBox = form.querySelector("[data-form-error]");
        var successBox = document.querySelector("[data-success-box]");
        if(errorBox) errorBox.classList.add("hidden");

        var originalLabel = submitBtn ? submitBtn.textContent : "";
        if(submitBtn){
          submitBtn.setAttribute("disabled", "disabled");
          submitBtn.textContent = t("f_sending");
        }

        var formData = new FormData(form);

        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: formData
        }).then(function(res){ return res.json(); })
          .then(function(data){
            if(data.success){
              form.classList.add("hidden");
              if(successBox) successBox.classList.add("show");
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              throw new Error(data.message || "error");
            }
          })
          .catch(function(){
            if(errorBox) errorBox.classList.remove("hidden");
            if(submitBtn){
              submitBtn.removeAttribute("disabled");
              submitBtn.textContent = originalLabel;
            }
          });
      });
    });

    /* ---------- platform chip -> hidden summary field (for media brief) ---------- */
    var platformChips = document.querySelectorAll("[data-platform-chip]");
    var platformSummary = document.querySelector("[data-platform-summary]");
    if(platformChips.length && platformSummary){
      var updatePlatforms = function(){
        var picked = [];
        platformChips.forEach(function(c){ if(c.checked) picked.push(c.value); });
        platformSummary.value = picked.join(", ");
      };
      platformChips.forEach(function(c){ c.addEventListener("change", updatePlatforms); });
      updatePlatforms();
    }
  });
})();
