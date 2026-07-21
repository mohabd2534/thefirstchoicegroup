/* The First Choice Group — shared site chrome (nav, footer, chat widget)
   and behaviour (hover effects, mobile nav). No build step, no framework.
   Ported from the SiteNav / SiteFooter / ChatWidget design components. */
(function () {
  'use strict';

  // Brand logo — twin-peak "rooflines" mark in the site's blue -> cyan gradient
  // so it reads cleanly on the dark navy. Swap paths/colors here to change it
  // site-wide (nav, footer, favicon derived from the same shape).
  function logoMark(id) {
    return '<svg width="62" height="28" viewBox="0 0 116 52" style="flex-shrink:0" role="img" aria-label="The First Choice Group">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9BD4FF"/><stop offset="0.55" stop-color="#5AB8F5"/><stop offset="1" stop-color="#37C8E0"/></linearGradient></defs>' +
      '<path d="M8 44 L34 12 L60 44" fill="none" stroke="url(#' + id + ')" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M50 44 L76 12 L102 44" fill="none" stroke="url(#' + id + ')" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }
  function logoLockup(id) {
    return logoMark(id) +
      '<span style="display:flex;flex-direction:column;line-height:1.05">' +
        '<span style="font:800 16px \'Sora\',sans-serif;color:#fff;letter-spacing:.005em">First Choice Group</span>' +
        '<span style="font:700 7.5px \'Manrope\',sans-serif;color:#7ACBFF;letter-spacing:.26em;margin-top:3px">REAL ESTATE SOLUTIONS</span>' +
      '</span>';
  }

  var SITUATIONS = [
    ['/just-selling', 'Just Looking to Sell'],
    ['/foreclosure', 'Facing Foreclosure'],
    ['/repairs', 'Too Many Repairs'],
    ['/probate', 'Inherited &amp; Probate'],
    ['/relocation', 'Relocation &amp; Divorce']
  ];

  /* -------------------------------------------------- hover effects
     Reproduces the design's `style-hover`: apply the given declarations on
     mouseenter, restore on mouseleave. Values are kept in the element's
     data-hover attribute as "prop:val;prop:val". */
  function wireHover(root) {
    (root || document).querySelectorAll('[data-hover]').forEach(function (el) {
      if (el.__hoverWired) return;
      el.__hoverWired = true;
      var decls = el.getAttribute('data-hover').split(';').map(function (d) {
        var i = d.indexOf(':');
        return i < 0 ? null : [d.slice(0, i).trim(), d.slice(i + 1).trim()];
      }).filter(Boolean);
      el.addEventListener('mouseenter', function () {
        decls.forEach(function (d) {
          el.setAttribute('data-h-' + d[0], el.style.getPropertyValue(d[0]));
          el.style.setProperty(d[0], d[1]);
        });
      });
      el.addEventListener('mouseleave', function () {
        decls.forEach(function (d) {
          el.style.setProperty(d[0], el.getAttribute('data-h-' + d[0]) || '');
        });
      });
    });
  }

  /* -------------------------------------------------- navigation */
  function buildNav() {
    var host = document.getElementById('site-nav');
    if (!host) return;

    var dropdown = SITUATIONS.map(function (s) {
      return '<a href="' + s[0] + '" data-hover="background:#ffffff0f;color:#7ACBFF" ' +
        'style="color:#C9D6E8;text-decoration:none;padding:10px 14px;border-radius:9px;font:600 14px \'Manrope\',sans-serif">' +
        s[1] + '</a>';
    }).join('');

    host.innerHTML =
      '<div style="position:sticky;top:0;z-index:80;background:#081426F0;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid #ffffff14">' +
      '<div style="max-width:1240px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:12px 32px">' +
        '<a href="/" style="display:flex;align-items:center;gap:11px;text-decoration:none">' + logoLockup('fcg-nav') + '</a>' +
        '<div class="nav-links" style="display:flex;align-items:center;gap:30px;font:600 14.5px \'Manrope\',sans-serif">' +
          '<a href="/" data-hover="color:#7ACBFF" style="color:#C9D6E8;text-decoration:none">Home</a>' +
          '<span style="position:relative">' +
            '<span id="nav-sit" data-hover="color:#7ACBFF" style="color:#C9D6E8;cursor:pointer;display:flex;align-items:center;gap:6px">Situations <span style="font-size:10px">&#9660;</span></span>' +
            '<div id="nav-sit-menu" style="display:none;position:absolute;top:34px;left:-12px;background:#0E2240;border:1px solid #ffffff1f;border-radius:14px;padding:8px;flex-direction:column;gap:2px;min-width:230px;box-shadow:0 20px 50px rgba(0,0,0,.5)">' + dropdown + '</div>' +
          '</span>' +
          '<a href="/loan-programs" data-hover="color:#7ACBFF" style="color:#C9D6E8;text-decoration:none">Loan Programs</a>' +
          '<a href="/about" data-hover="color:#7ACBFF" style="color:#C9D6E8;text-decoration:none">About</a>' +
          '<a href="/contact" data-hover="color:#7ACBFF" style="color:#C9D6E8;text-decoration:none">Contact</a>' +
        '</div>' +
        '<a class="nav-cta" href="/offer" data-hover="background:#7ACBFF" style="background:#5AB8F5;color:#081426;font:700 14px \'Manrope\',sans-serif;padding:12px 22px;border-radius:11px;text-decoration:none;white-space:nowrap;box-shadow:0 6px 18px rgba(90,184,245,.25)">Get Your Cash Offer</a>' +
        '<span class="nav-toggle" id="nav-toggle" style="width:42px;height:42px;border-radius:10px;background:#ffffff10;align-items:center;justify-content:center;cursor:pointer;color:#C9D6E8;font-size:20px">&#9776;</span>' +
      '</div>' +
      '<div class="mobile-menu" id="mobile-menu" style="flex-direction:column;gap:4px;padding:8px 20px 18px;border-top:1px solid #ffffff12;background:#0B1B33">' +
        mobileLink('/', 'Home') +
        '<div style="font:700 11px \'Manrope\',sans-serif;color:#5AB8F5;letter-spacing:.08em;padding:12px 8px 4px">SITUATIONS</div>' +
        SITUATIONS.map(function (s) { return mobileLink(s[0], s[1], true); }).join('') +
        mobileLink('/loan-programs', 'Loan Programs') +
        mobileLink('/about', 'About') +
        mobileLink('/contact', 'Contact') +
        '<a href="/offer" style="margin-top:10px;background:#5AB8F5;color:#081426;font:700 14px \'Manrope\',sans-serif;padding:14px;border-radius:11px;text-decoration:none;text-align:center">Get Your Cash Offer</a>' +
      '</div>' +
      '</div>';

    // Situations dropdown (desktop, click to toggle)
    var sit = document.getElementById('nav-sit');
    var sitMenu = document.getElementById('nav-sit-menu');
    var sitOpen = false;
    function setSit(open) { sitOpen = open; sitMenu.style.display = open ? 'flex' : 'none'; }
    sit.addEventListener('click', function (e) { e.stopPropagation(); setSit(!sitOpen); });
    document.addEventListener('click', function () { if (sitOpen) setSit(false); });

    // Mobile menu toggle
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('mobile-menu');
    toggle.addEventListener('click', function () { menu.classList.toggle('open'); });
  }

  function mobileLink(href, label, indent) {
    return '<a href="' + href + '" data-hover="color:#7ACBFF" style="color:#C9D6E8;text-decoration:none;font:600 15px \'Manrope\',sans-serif;padding:11px ' + (indent ? '18px' : '8px') + '">' + label + '</a>';
  }

  /* -------------------------------------------------- footer */
  function buildFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;

    var link = function (href, label) {
      return '<a href="' + href + '" data-hover="color:#7ACBFF" style="font:500 14px \'Manrope\',sans-serif;color:#8DA0BC;text-decoration:none">' + label + '</a>';
    };
    var social = function (t) {
      return '<span data-hover="background:#5AB8F5;color:#081426" style="width:36px;height:36px;border-radius:10px;background:#ffffff10;display:flex;align-items:center;justify-content:center;color:#C9D6E8;font:700 13px \'Manrope\',sans-serif;cursor:pointer">' + t + '</span>';
    };

    host.innerHTML =
      '<div style="background:#050E1C;border-top:1px solid #ffffff12">' +
      '<div class="cols pad-sec" style="max-width:1240px;margin:0 auto;padding:64px 32px 32px;grid-template-columns:minmax(0,1.5fr) repeat(3,minmax(0,1fr));gap:48px">' +
        '<div style="display:flex;flex-direction:column;gap:16px">' +
          '<span style="display:flex;align-items:center;gap:11px;align-self:flex-start">' + logoLockup('fcg-ft') + '</span>' +
          '<div style="font:500 14px/1.7 \'Manrope\',sans-serif;color:#8DA0BC;max-width:320px">A professional real estate solutions and redevelopment company. Cash offers for sellers, capital for investors — built on People, Service, and Integrity.</div>' +
          '<div style="font:700 12px \'Manrope\',sans-serif;color:#5AB8F5;letter-spacing:.08em">WHEREVER YOUR PROPERTY IS &mdash; WE&rsquo;LL MAKE AN OFFER</div>' +
          '<div style="display:flex;gap:10px">' + social('f') + social('in') + social('ig') + social('✕') + '</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:12px">' +
          '<div style="font:700 13px \'Sora\',sans-serif;color:#fff;letter-spacing:.06em;margin-bottom:4px">SOLUTIONS</div>' +
          link('/just-selling', 'Just Looking to Sell') +
          link('/foreclosure', 'Facing Foreclosure') +
          link('/repairs', 'Too Many Repairs') +
          link('/probate', 'Inherited &amp; Probate') +
          link('/relocation', 'Relocation &amp; Divorce') +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:12px">' +
          '<div style="font:700 13px \'Sora\',sans-serif;color:#fff;letter-spacing:.06em;margin-bottom:4px">COMPANY</div>' +
          link('/about', 'About Us') +
          link('/loan-programs', 'Loan Programs') +
          link('/contact', 'Contact') +
          link('/faq', 'Common Questions') +
          link('/estimator', 'Instant Offer Estimator') +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:14px">' +
          '<div style="font:700 13px \'Sora\',sans-serif;color:#fff;letter-spacing:.06em;margin-bottom:4px">GET STARTED</div>' +
          '<div style="font:500 13px/1.6 \'Manrope\',sans-serif;color:#8DA0BC">Your no-obligation cash offer is one address away.</div>' +
          '<a href="/offer" data-hover="background:#7ACBFF;color:#081426" style="background:#5AB8F5;color:#081426;font:700 14px \'Manrope\',sans-serif;padding:13px 20px;border-radius:11px;text-decoration:none;text-align:center">Get Your Cash Offer</a>' +
          '<div style="display:flex;align-items:center;gap:8px;font:600 12px \'Manrope\',sans-serif;color:#8DA0BC"><span style="background:#00548F;color:#fff;font:800 11px \'Sora\',sans-serif;padding:4px 7px;border-radius:4px;letter-spacing:.02em">BBB</span> A+ Accredited Business</div>' +
        '</div>' +
      '</div>' +
      '<div class="pad-sec" style="max-width:1240px;margin:0 auto;padding:24px 32px;border-top:1px solid #ffffff0f;display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap">' +
        '<div style="font:500 12.5px \'Manrope\',sans-serif;color:#5F7392">&copy; 2026 The First Choice Group. All rights reserved.</div>' +
        '<div style="font:500 12.5px \'Manrope\',sans-serif;color:#5F7392">Offer estimates are preliminary and subject to property review. Not a lender in all states.</div>' +
      '</div>' +
      '</div>';
  }

  /* -------------------------------------------------- chat widget */
  function chatAnswer(q) {
    var t = q.toLowerCase();
    if (/looking to sell|sell my|want to sell|^sell\b/.test(t)) return "You're in the right place — we buy houses for cash, in any condition, with zero fees or commissions and a closing date you choose. The fastest way to a real number is our quick 3-minute offer form. Tap 'Get Your Cash Offer' below to start — or ask me anything first.";
    if (/looking to buy|buy a|purchase|inventory|off.?market/.test(t)) return "For buyers and investors we offer financing — fix-and-flip, bridge, and rental (DSCR) loans — and occasionally have off-market properties. Are you funding a deal or looking for inventory? Tell me a bit more and I'll point you the right way.";
    if (/lending|funding|loan|lend|flip|invest|rehab|financ|rate/.test(t)) return "We fund investors: fix-and-flip up to 90% of purchase and 100% of rehab, plus bridge and 30-year rental loans — term sheets in 24 hours. See the Loan Programs page, or share your deal and a loan specialist will follow up.";
    if (/^other|something else|just looking|not sure/.test(t)) return "No problem — I can help with selling a property, buying or funding a deal, timelines, fees, or anything else. What's on your mind?";
    if (/fee|commission|cost|charge/.test(t)) return "Zero. No commissions, no fees, and we pay all closing costs. The offer you accept is the amount you walk away with — we can put that in writing.";
    if (/foreclos/.test(t)) return "We help sellers in pre-foreclosure all the time. Because we buy in cash with no financing contingencies, we can often close before an auction date — sometimes in as little as 10 days. Want me to start a no-obligation offer for your property?";
    if (/probate|inherit|estate/.test(t)) return "Inherited properties are one of our specialties. We coordinate with your probate attorney, buy fully as-is (belongings can stay), and time the closing around the court process. No cleanout needed.";
    if (/repair|as.?is|condition|fix|damage|old/.test(t)) return "We buy 100% as-is — fire damage, code violations, decades of deferred maintenance, all of it. You never make a repair or even clean. Our offer already accounts for condition.";
    if (/how (fast|long)|close|timeline|days|quick/.test(t)) return "Our average is 26 days from offer to closing, and we can move as fast as 10 days when needed. You pick the date — we work around your timeline, not the other way around.";
    if (/worth|value|offer|estimate|price|much/.test(t)) return "Our instant estimator can give you a preliminary cash-offer range in about 60 seconds — just enter your address and answer a few quick questions. Tap 'Get Your Cash Offer' at the top of the page to start.";
    if (/loan|lend|flip|invest|rehab|financ|rate/.test(t)) return "For investors we offer fix-and-flip loans up to 90% of purchase and 100% of rehab, plus bridge financing. Check the Loan Programs page, or I can have a loan specialist call you.";
    if (/agent|realtor|list/.test(t)) return "Unlike listing with an agent: no 6% commission, no showings, no appraisal or financing contingencies, and no 90-day wait. If a traditional listing is genuinely your better option, we'll tell you that too.";
    if (/scam|legit|trust|real/.test(t)) return "Fair question. We're a BBB A+ accredited business with a 4.9★ Google rating across 300+ reviews, and 1,300+ homeowners helped. Happy to share references before you commit to anything.";
    if (/call|talk|human|person|phone/.test(t)) return "Of course — a real specialist (not a bot) can call you within one business hour. Just head to the Contact page and leave your number, or share it here.";
    return "Great question — here's the short version: we make no-obligation cash offers, buy fully as-is, charge zero fees, and close on your date. Could you share your property's city and state so I can point you to the right next step?";
  }

  function buildChat() {
    var host = document.createElement('div');
    host.id = 'site-chat';
    document.body.appendChild(host);

    var state = {
      open: false,
      typing: false,
      unread: 1,
      msgs: [{ who: 'ai', text: "Hi 👋 Welcome to The First Choice Group! I'm here to help — what brings you in today?" }]
    };
    var scrollEl;

    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function render() {
      var qr = state.msgs.length <= 1
        ? { big: true, items: [
            { label: 'Looking to Sell', send: 'Looking to Sell' },
            { label: 'Looking to Buy', send: 'Looking to Buy' },
            { label: 'Lending / Funding', send: 'Lending / Funding' },
            { label: 'Other', send: 'Other' }
          ] }
        : { big: false, items: [
            { label: 'How fast can you close?', send: 'How fast can you close?' },
            { label: 'Do you charge fees?', send: 'Do you charge fees?' },
            { label: 'Get Your Cash Offer →', nav: '/offer' }
          ] };

      var msgHtml = state.msgs.map(function (m) {
        var ai = m.who === 'ai';
        var justify = ai ? 'flex-start' : 'flex-end';
        var bg = ai ? '#ffffff12' : '#5AB8F5';
        var color = ai ? '#DCE6F4' : '#081426';
        var radius = ai ? '14px 14px 14px 4px' : '14px 14px 4px 14px';
        return '<div style="display:flex;justify-content:' + justify + '">' +
          '<div style="max-width:82%;padding:11px 14px;border-radius:' + radius + ';background:' + bg + ';color:' + color + ';font:500 13.5px/1.55 \'Manrope\',sans-serif;white-space:pre-line">' + esc(m.text) + '</div></div>';
      }).join('');

      if (state.typing) {
        msgHtml += '<div style="align-self:flex-start;background:#ffffff12;border-radius:14px 14px 14px 4px;padding:12px 16px;color:#8DA0BC;font:600 13px \'Manrope\',sans-serif;letter-spacing:2px">&bull;&bull;&bull;</div>';
      }

      var chipsHtml;
      if (qr.big) {
        var bp = "font:700 14px 'Manrope',sans-serif;padding:13px 16px;border-radius:12px;cursor:pointer;text-align:center";
        var hp = "flex:1;font:700 12.5px 'Manrope',sans-serif;padding:11px;border-radius:12px;cursor:pointer;text-align:center";
        chipsHtml = '<div style="display:flex;flex-direction:column;gap:8px;width:100%">' +
          '<span data-qr="0" data-hover="background:#7ACBFF" style="background:#5AB8F5;color:#081426;' + bp + '">' + esc(qr.items[0].label) + '</span>' +
          '<span data-qr="1" data-hover="border-color:#5AB8F5;color:#fff" style="border:1px solid #5AB8F566;color:#C9D6E8;' + bp + '">' + esc(qr.items[1].label) + '</span>' +
          '<div style="display:flex;gap:8px">' +
            '<span data-qr="2" data-hover="border-color:#5AB8F5;color:#fff" style="border:1px solid #ffffff26;color:#C9D6E8;' + hp + '">' + esc(qr.items[2].label) + '</span>' +
            '<span data-qr="3" data-hover="border-color:#5AB8F5;color:#fff" style="border:1px solid #ffffff26;color:#C9D6E8;' + hp + '">' + esc(qr.items[3].label) + '</span>' +
          '</div>' +
        '</div>';
      } else {
        chipsHtml = qr.items.map(function (it, i) {
          var navStyle = it.nav ? 'background:#5AB8F51f;' : '';
          return '<span data-qr="' + i + '" data-hover="background:#5AB8F51f" style="' + navStyle + 'border:1px solid #5AB8F566;color:#7ACBFF;font:600 11.5px \'Manrope\',sans-serif;padding:6px 11px;border-radius:999px;cursor:pointer">' + esc(it.label) + '</span>';
        }).join('');
      }

      var panel = state.open ?
        '<div style="width:370px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:#0E2240;border:1px solid #ffffff1f;border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.55);display:flex;flex-direction:column;overflow:hidden">' +
          '<div style="padding:16px 18px;background:#0B1B33;border-bottom:1px solid #ffffff14;display:flex;align-items:center;gap:12px">' +
            '<span style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#5AB8F5,#37C8E0);display:flex;align-items:center;justify-content:center;font:800 15px \'Sora\',sans-serif;color:#081426">&#9672;</span>' +
            '<span style="display:flex;flex-direction:column;gap:2px">' +
              '<span style="font:700 14px \'Sora\',sans-serif;color:#fff">First Choice Group</span>' +
              '<span style="display:flex;align-items:center;gap:6px;font:600 11px \'Manrope\',sans-serif;color:#2EC98E"><span style="width:6px;height:6px;border-radius:50%;background:#2EC98E"></span>Online Agent</span>' +
            '</span>' +
            '<span id="chat-close" data-hover="color:#fff" style="margin-left:auto;color:#8DA0BC;cursor:pointer;font:600 18px \'Manrope\',sans-serif;padding:4px 8px">&times;</span>' +
          '</div>' +
          '<div id="chat-scroll" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px">' + msgHtml + '</div>' +
          '<div style="padding:10px 14px 6px;display:flex;gap:8px;flex-wrap:wrap">' + chipsHtml + '</div>' +
          '<div style="padding:12px 14px 14px;display:flex;gap:8px">' +
            '<input id="chat-input" placeholder="Ask anything about selling…" style="flex:1;background:#081426;border:1px solid #ffffff1f;border-radius:11px;padding:12px 14px;color:#fff;font:500 13.5px \'Manrope\',sans-serif;outline:none">' +
            '<span id="chat-send" data-hover="background:#7ACBFF" style="background:#5AB8F5;color:#081426;border-radius:11px;padding:12px 16px;font:700 13px \'Manrope\',sans-serif;cursor:pointer">&uarr;</span>' +
          '</div>' +
        '</div>' : '';

      host.innerHTML =
        '<div style="position:fixed;bottom:24px;right:24px;z-index:100;display:flex;flex-direction:column;align-items:flex-end;gap:14px;font-family:\'Manrope\',sans-serif">' +
          panel +
          '<div id="chat-fab" data-hover="transform:scale(1.06)" style="position:relative;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#5AB8F5,#37C8E0);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 14px 40px rgba(90,184,245,.4);font:800 22px \'Sora\',sans-serif;color:#081426">' + (state.open ? '&times;' : '&#9672;') +
            (!state.open ? '<span style="position:absolute;bottom:3px;right:3px;width:12px;height:12px;border-radius:50%;background:#2EC98E;border:2px solid #fff"></span>' : '') +
            (!state.open && state.unread ? '<span style="position:absolute;top:-3px;left:-3px;min-width:22px;height:22px;padding:0 5px;border-radius:11px;background:#0B1B33;color:#fff;border:2px solid #081426;display:flex;align-items:center;justify-content:center;font:800 12px \'Manrope\',sans-serif">' + state.unread + '</span>' : '') +
          '</div>' +
        '</div>';

      wireHover(host);

      document.getElementById('chat-fab').addEventListener('click', function () {
        state.open = !state.open; if (state.open) state.unread = 0; render(); scrollDown();
      });
      if (state.open) {
        document.getElementById('chat-close').addEventListener('click', function () { state.open = false; render(); });
        var input = document.getElementById('chat-input');
        var send = function () { doSend(input.value); };
        document.getElementById('chat-send').addEventListener('click', send);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
        host.querySelectorAll('[data-qr]').forEach(function (el) {
          el.addEventListener('click', function () {
            var it = qr.items[+el.getAttribute('data-qr')];
            if (it.nav) { window.location.href = it.nav; return; }
            doSend(it.send || it.label);
          });
        });
        scrollEl = document.getElementById('chat-scroll');
        scrollDown();
      }
    }

    function scrollDown() {
      setTimeout(function () { if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight; }, 30);
    }

    function doSend(text) {
      var q = (text || '').trim();
      if (!q || state.typing) return;
      state.msgs.push({ who: 'me', text: q });
      state.typing = true;
      render(); scrollDown();
      setTimeout(function () {
        state.msgs.push({ who: 'ai', text: chatAnswer(q) });
        state.typing = false;
        render(); scrollDown();
      }, 900);
    }

    render();
  }

  /* -------------------------------------------------- address autocomplete
     Type-ahead + one-tap "use my location" so sellers never type a full
     address. Uses OpenStreetMap's free Nominatim geocoder (no API key, CORS
     enabled). Swap the endpoint for Google Places / Mapbox later if desired. */
  var GEO = 'https://nominatim.openstreetmap.org';

  function fmtAddr(d) {
    var a = d.address || {};
    var road = (a.house_number ? a.house_number + ' ' : '') + (a.road || '');
    var city = a.city || a.town || a.village || a.hamlet || a.county || '';
    var parts = [road, city, a.state, a.postcode].filter(Boolean);
    return parts.length ? parts.join(', ') : (d.display_name || '');
  }

  // A value counts as a "full address" if it was picked from the list, or it
  // plausibly contains a street number + street + more. Pages gate progress on this.
  function addressValid(input) {
    if (!input) return false;
    if (input.dataset && input.dataset.addrValid === '1') return true;
    var v = (input.value || '').trim();
    return v.length >= 6 && /\d/.test(v) && /[a-zA-Z]/.test(v) &&
           (v.indexOf(',') > -1 || v.split(/\s+/).length >= 3);
  }

  function initAddressAutocomplete(input) {
    if (!input || input.__addr) return;
    input.__addr = true;
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('spellcheck', 'false');

    var dd = document.createElement('div');
    dd.className = 'addr-dd';
    dd.style.cssText = 'position:fixed;z-index:300;background:#0E2240;border:1px solid #ffffff26;border-radius:12px;box-shadow:0 20px 50px rgba(0,0,0,.55);overflow-y:auto;max-height:270px;display:none';
    document.body.appendChild(dd);

    var items = [], timer = null, seq = 0;

    function place() {
      var r = input.getBoundingClientRect();
      dd.style.left = r.left + 'px';
      dd.style.top = (r.bottom + 6) + 'px';
      dd.style.width = Math.max(240, r.width) + 'px';
    }
    function hide() { dd.style.display = 'none'; }
    function show() { place(); dd.style.display = 'block'; }

    function render(q) {
      var html = '';
      if (!q) html += '<div class="addr-row" data-loc="1" style="padding:12px 14px;color:#7ACBFF;font:600 13.5px \'Manrope\',sans-serif;cursor:pointer;display:flex;gap:9px;align-items:center"><span>◎</span><span>Use my current location</span></div>';
      items.forEach(function (it, i) {
        html += '<div class="addr-row" data-i="' + i + '" style="padding:11px 14px;color:#DCE6F4;font:500 13.5px \'Manrope\',sans-serif;cursor:pointer">' + esc(it) + '</div>';
      });
      if (q && !items.length) html += '<div style="padding:11px 14px;color:#8DA0BC;font:500 12.5px \'Manrope\',sans-serif">Keep typing your full address…</div>';
      dd.innerHTML = html;
      show();
      var loc = dd.querySelector('[data-loc]');
      if (loc) loc.addEventListener('mousedown', function (e) { e.preventDefault(); useLocation(); });
      dd.querySelectorAll('[data-i]').forEach(function (row) {
        row.addEventListener('mousedown', function (e) { e.preventDefault(); choose(items[+row.getAttribute('data-i')]); });
      });
    }

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function choose(val) {
      input.value = val;
      input.dataset.addrValid = '1';
      hide();
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function search(q) {
      var my = ++seq;
      fetch(GEO + '/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=us&q=' + encodeURIComponent(q))
        .then(function (r) { return r.json(); })
        .then(function (data) { if (my !== seq) return; items = (data || []).map(fmtAddr).filter(Boolean); render(q); })
        .catch(function () { items = []; render(q); });
    }

    function useLocation() {
      hide();
      if (!navigator.geolocation) return;
      var prev = input.value;
      input.value = 'Locating…'; input.disabled = true;
      navigator.geolocation.getCurrentPosition(function (pos) {
        fetch(GEO + '/reverse?format=jsonv2&addressdetails=1&lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude)
          .then(function (r) { return r.json(); })
          .then(function (d) {
            input.disabled = false;
            input.value = fmtAddr(d) || prev; input.dataset.addrValid = '1';
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.focus();
          })
          .catch(function () { input.disabled = false; input.value = prev; });
      }, function () { input.disabled = false; input.value = prev; }, { enableHighAccuracy: true, timeout: 8000 });
    }

    input.addEventListener('input', function () {
      input.dataset.addrValid = '';
      var q = input.value.trim();
      if (timer) clearTimeout(timer);
      if (q.length < 3) { items = []; render(''); return; }
      timer = setTimeout(function () { search(q); }, 350);
    });
    input.addEventListener('focus', function () { if (!input.value.trim()) render(''); else if (items.length) show(); });
    input.addEventListener('blur', function () { setTimeout(hide, 150); });
    window.addEventListener('scroll', function () { if (dd.style.display !== 'none') place(); }, true);
    window.addEventListener('resize', function () { if (dd.style.display !== 'none') place(); });
  }

  function initAllAddress(root) {
    (root || document).querySelectorAll('input[data-addr]').forEach(initAddressAutocomplete);
  }

  /* -------------------------------------------------- boot */
  function init() {
    buildNav();
    buildFooter();
    buildChat();
    wireHover(document);
    initAllAddress(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // expose for page scripts that inject markup later
  window.FCG = {
    wireHover: wireHover,
    initAddressAutocomplete: initAddressAutocomplete,
    initAllAddress: initAllAddress,
    addressValid: addressValid
  };
})();
