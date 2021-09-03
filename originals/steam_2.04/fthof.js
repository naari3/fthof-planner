var M = {};
M.parent = Game.Objects["Wizard tower"];
M.parent.minigame = M;
M.launch = function () {
  var M = this;
  M.name = M.parent.minigameName;
  M.init = function (div) {
    //populate div with html and initialize values

    M.spells = {
      "hand of fate": {
        name: loc("Force the Hand of Fate"),
        desc: loc(
          "Summon a random golden cookie. Each existing golden cookie makes this spell +%1% more likely to backfire.",
          15
        ),
        failDesc: loc("Summon an unlucky wrath cookie."),
        icon: [22, 11],
        costMin: 10,
        costPercent: 0.6,
        failFunc: function (fail) {
          return fail + 0.15 * Game.shimmerTypes["golden"].n;
        },
        win: function () {
          var newShimmer = new Game.shimmer("golden", { noWrath: true });
          var choices = [];
          choices.push("frenzy", "multiply cookies");
          if (!Game.hasBuff("Dragonflight")) choices.push("click frenzy");
          if (Math.random() < 0.1)
            choices.push("cookie storm", "cookie storm", "blab");
          if (Game.BuildingsOwned >= 10 && Math.random() < 0.25)
            choices.push("building special");
          //if (Math.random()<0.2) choices.push('clot','cursed finger','ruin cookies');
          if (Math.random() < 0.15) choices = ["cookie storm drop"];
          if (Math.random() < 0.0001) choices.push("free sugar lump");
          newShimmer.force = choose(choices);
          if (newShimmer.force == "cookie storm drop") {
            newShimmer.sizeMult = Math.random() * 0.75 + 0.25;
          }
          Game.Popup(
            '<div style="font-size:80%;">' + loc("Promising fate!") + "</div>",
            Game.mouseX,
            Game.mouseY
          );
        },
        fail: function () {
          var newShimmer = new Game.shimmer("golden", { wrath: true });
          var choices = [];
          choices.push("clot", "ruin cookies");
          if (Math.random() < 0.1)
            choices.push("cursed finger", "blood frenzy");
          if (Math.random() < 0.003) choices.push("free sugar lump");
          if (Math.random() < 0.1) choices = ["blab"];
          newShimmer.force = choose(choices);
          Game.Popup(
            '<div style="font-size:80%;">' +
              loc("Backfire!") +
              "<br>" +
              loc("Sinister fate!") +
              "</div>",
            Game.mouseX,
            Game.mouseY
          );
        },
      },
    };
    M.spellsById = [];
    var n = 0;
    for (var i in M.spells) {
      M.spells[i].id = n;
      M.spellsById[n] = M.spells[i];
      n++;
    }

    M.computeMagicM = function () {
      var towers = Math.max(M.parent.amount, 1);
      var lvl = Math.max(M.parent.level, 1);
      M.magicM = Math.floor(
        4 +
          Math.pow(towers, 0.6) +
          Math.log((towers + (lvl - 1) * 10) / 15 + 1) * 15
      );
      //old formula :
      /*
			M.magicM=8+Math.min(M.parent.amount,M.parent.level*5)+Math.ceil(M.parent.amount/10);
			if (M.magicM>200)
			{
				//diminishing returns starting at 200, being 5% as fast by 400
				var x=M.magicM;
				var top=x-200;
				top/=200;
				var top2=top;
				top*=(1-top/2);
				if (top2>=1) top=0.5;
				top=top*0.95+top2*0.05;
				top*=200;
				x=top+200;
				M.magicM=x;
			}
			*/
      M.magic = Math.min(M.magicM, M.magic);
    };

    M.getFailChance = function (spell) {
      var failChance = 0.15;
      if (Game.hasBuff("Magic adept")) failChance *= 0.1;
      if (Game.hasBuff("Magic inept")) failChance *= 5;
      if (spell.failFunc) failChance = spell.failFunc(failChance);
      return failChance;
    };

    M.castSpell = function (spell, obj) {
      var obj = obj || {};
      var out = 0;
      var cost = 0;
      var fail = false;
      if (typeof obj.cost !== "undefined") cost = obj.cost;
      else cost = M.getSpellCost(spell);
      if (M.magic < cost) return false;
      var failChance = M.getFailChance(spell);
      if (typeof obj.failChanceSet !== "undefined")
        failChance = obj.failChanceSet;
      if (typeof obj.failChanceAdd !== "undefined")
        failChance += obj.failChanceAdd;
      if (typeof obj.failChanceMult !== "undefined")
        failChance *= obj.failChanceMult;
      if (typeof obj.failChanceMax !== "undefined")
        failChance = Math.max(failChance, obj.failChanceMax);
      Math.seedrandom(Game.seed + "/" + M.spellsCastTotal);
      if (!spell.fail || Math.random() < 1 - failChance) {
        out = spell.win();
      } else {
        fail = true;
        out = spell.fail();
      }
      Math.seedrandom();
      if (out != -1) {
        if (!spell.passthrough && !obj.passthrough) {
          M.spellsCast++;
          M.spellsCastTotal++;
          if (M.spellsCastTotal >= 9) Game.Win("Bibbidi-bobbidi-boo");
          if (M.spellsCastTotal >= 99) Game.Win("I'm the wiz");
          if (M.spellsCastTotal >= 999) Game.Win("A wizard is you");
        }

        M.magic -= cost;
        M.magic = Math.max(0, M.magic);

        var rect = l("grimoireSpell" + spell.id).getBounds();
        Game.SparkleAt(
          (rect.left + rect.right) / 2,
          (rect.top + rect.bottom) / 2 - 24
        );

        if (fail) PlaySound("snd/spellFail.mp3", 0.75);
        else PlaySound("snd/spell.mp3", 0.75);
        return true;
      }
      PlaySound("snd/spellFail.mp3", 0.75);
      return false;
    };

    M.getSpellCost = function (spell) {
      var out = spell.costMin;
      if (spell.costPercent) out += M.magicM * spell.costPercent;
      return Math.floor(out);
    };
    M.getSpellCostBreakdown = function (spell) {
      var str = "";
      if (spell.costPercent)
        str +=
          loc("%1 magic", Beautify(spell.costMin)) +
          " " +
          loc(
            "+%1% of max magic",
            Beautify(Math.ceil(spell.costPercent * 100))
          );
      else str += loc("%1 magic", Beautify(spell.costMin));
      return str;
    };

    M.spellTooltip = function (id) {
      return function () {
        var me = M.spellsById[id];
        me.icon = me.icon || [28, 12];
        var cost = Beautify(M.getSpellCost(me));
        var costBreakdown = M.getSpellCostBreakdown(me);
        if (cost != costBreakdown)
          costBreakdown = " <small>(" + costBreakdown + ")</small>";
        else costBreakdown = "";
        var backfire = M.getFailChance(me);
        var str =
          '<div style="padding:8px 4px;min-width:350px;">' +
          '<div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;background-position:' +
          -me.icon[0] * 48 +
          "px " +
          -me.icon[1] * 48 +
          'px;"></div>' +
          '<div class="name">' +
          me.name +
          "</div>" +
          "<div>" +
          loc("Magic cost:") +
          ' <b style="color:#' +
          (cost <= M.magic ? "6f6" : "f66") +
          ';">' +
          cost +
          "</b>" +
          costBreakdown +
          "</div>" +
          (me.fail
            ? "<div><small>" +
              loc("Chance to backfire:") +
              ' <b style="color:#f66">' +
              Math.ceil(100 * backfire) +
              "%</b></small></div>"
            : "") +
          '<div class="line"></div><div class="description"><b>' +
          loc("Effect:") +
          '</b> <span class="green">' +
          (me.descFunc ? me.descFunc() : me.desc) +
          "</span>" +
          (me.failDesc
            ? '<div style="height:8px;"></div><b>' +
              loc("Backfire:") +
              '</b> <span class="red">' +
              me.failDesc +
              "</span>"
            : "") +
          "</div></div>";
        return str;
      };
    };

    var str = "";
    str +=
      "<style>" +
      "#grimoireBG{background:url(img/shadedBorders.png),url(img/BGgrimoire.jpg);background-size:100% 100%,auto;position:absolute;left:0px;right:0px;top:0px;bottom:16px;}" +
      "#grimoireContent{position:relative;box-sizing:border-box;padding:4px 24px;}" +
      "#grimoireBar{max-width:95%;margin:4px auto;height:16px;}" +
      "#grimoireBarFull{transform:scale(1,2);transform-origin:50% 0;height:50%;}" +
      "#grimoireBarText{transform:scale(1,0.8);width:100%;position:absolute;left:0px;top:0px;text-align:center;color:#fff;text-shadow:-1px 1px #000,0px 0px 4px #000,0px 0px 6px #000;margin-top:2px;}" +
      "#grimoireSpells{text-align:center;width:100%;padding:8px;box-sizing:border-box;}" +
      ".grimoireIcon{pointer-events:none;margin:2px 6px 0px 6px;width:48px;height:48px;opacity:0.8;position:relative;}" +
      ".grimoirePrice{pointer-events:none;}" +
      ".grimoireSpell{box-shadow:4px 4px 4px #000;cursor:pointer;position:relative;color:#f33;opacity:0.8;text-shadow:0px 0px 4px #000,0px 0px 6px #000;font-weight:bold;font-size:12px;display:inline-block;width:60px;height:74px;background:url(img/spellBG.png);}" +
      ".grimoireSpell.ready{color:rgba(255,255,255,0.8);opacity:1;}" +
      ".grimoireSpell.ready:hover{color:#fff;}" +
      ".grimoireSpell:hover{box-shadow:6px 6px 6px 2px #000;z-index:1000000001;top:-1px;}" +
      ".grimoireSpell:active{top:1px;}" +
      ".grimoireSpell.ready .grimoireIcon{opacity:1;}" +
      ".grimoireSpell:hover{background-position:0px -74px;} .grimoireSpell:active{background-position:0px 74px;}" +
      ".grimoireSpell:nth-child(4n+1){background-position:-60px 0px;} .grimoireSpell:nth-child(4n+1):hover{background-position:-60px -74px;} .grimoireSpell:nth-child(4n+1):active{background-position:-60px 74px;}" +
      ".grimoireSpell:nth-child(4n+2){background-position:-120px 0px;} .grimoireSpell:nth-child(4n+2):hover{background-position:-120px -74px;} .grimoireSpell:nth-child(4n+2):active{background-position:-120px 74px;}" +
      ".grimoireSpell:nth-child(4n+3){background-position:-180px 0px;} .grimoireSpell:nth-child(4n+3):hover{background-position:-180px -74px;} .grimoireSpell:nth-child(4n+3):active{background-position:-180px 74px;}" +
      ".grimoireSpell:hover .grimoireIcon{top:-1px;}" +
      ".grimoireSpell.ready:hover .grimoireIcon{animation-name:bounce;animation-iteration-count:infinite;animation-duration:0.8s;}" +
      ".noFancy .grimoireSpell.ready:hover .grimoireIcon{animation:none;}" +
      "#grimoireInfo{text-align:center;font-size:11px;margin-top:12px;color:rgba(255,255,255,0.75);text-shadow:-1px 1px 0px #000;}" +
      "</style>";
    str += '<div id="grimoireBG"></div>';
    str += '<div id="grimoireContent">';
    str += '<div id="grimoireSpells">'; //did you know adding class="shadowFilter" to this cancels the "z-index:1000000001" that displays the selected spell above the tooltip? stacking orders are silly https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
    for (var i in M.spells) {
      var me = M.spells[i];
      var icon = me.icon || [28, 12];
      str +=
        '<div class="grimoireSpell titleFont" id="grimoireSpell' +
        me.id +
        '" ' +
        Game.getDynamicTooltip(
          "Game.ObjectsById[" +
            M.parent.id +
            "].minigame.spellTooltip(" +
            me.id +
            ")",
          "this"
        ) +
        '><div class="usesIcon shadowFilter grimoireIcon" style="background-position:' +
        -icon[0] * 48 +
        "px " +
        -icon[1] * 48 +
        'px;"></div><div class="grimoirePrice" id="grimoirePrice' +
        me.id +
        '">-</div></div>';
    }
    str += "</div>";
    var icon = [29, 14];
    str +=
      '<div id="grimoireBar" class="smallFramed meterContainer" style="width:1px;"><div ' +
      Game.getDynamicTooltip(
        "Game.ObjectsById[" + M.parent.id + "].minigame.refillTooltip",
        "this"
      ) +
      ' id="grimoireLumpRefill" class="usesIcon shadowFilter lumpRefill" style="left:-40px;top:-17px;background-position:' +
      -icon[0] * 48 +
      "px " +
      -icon[1] * 48 +
      'px;"></div><div id="grimoireBarFull" class="meter filling" style="width:1px;"></div><div id="grimoireBarText" class="titleFont"></div><div ' +
      Game.getTooltip(
        '<div style="padding:8px;width:300px;font-size:11px;text-align:center;">' +
          loc(
            'This is your magic meter. Each spell costs magic to use.<div class="line"></div>Your maximum amount of magic varies depending on your amount of <b>Wizard towers</b>, and their level.<div class="line"></div>Magic refills over time. The lower your magic meter, the slower it refills.'
          ) +
          "</div>"
      ) +
      ' style="position:absolute;left:0px;top:0px;right:0px;bottom:0px;"></div></div>';
    str += '<div id="grimoireInfo"></div>';
    str += "</div>";
    div.innerHTML = str;
    M.magicBarL = l("grimoireBar");
    M.magicBarFullL = l("grimoireBarFull");
    M.magicBarTextL = l("grimoireBarText");
    M.lumpRefill = l("grimoireLumpRefill");
    M.infoL = l("grimoireInfo");
    for (var i in M.spells) {
      var me = M.spells[i];
      AddEvent(
        l("grimoireSpell" + me.id),
        "click",
        (function (spell) {
          return function () {
            PlaySound("snd/tick.mp3");
            M.castSpell(spell);
          };
        })(me)
      );
    }

    M.refillTooltip = function () {
      return (
        '<div style="padding:8px;width:300px;font-size:11px;text-align:center;">' +
        loc("Click to refill <b>%1 units</b> of your magic meter for %2.", [
          100,
          '<span class="price lump">' +
            loc("%1 sugar lump", LBeautify(1)) +
            "</span>",
        ]) +
        (Game.canRefillLump()
          ? "<br><small>(" +
            loc(
              "can be done once every %1",
              Game.sayTime(Game.getLumpRefillMax(), -1)
            ) +
            ")</small>"
          : '<br><small class="red">(' +
            loc(
              "usable again in %1",
              Game.sayTime(Game.getLumpRefillRemaining() + Game.fps, -1)
            ) +
            ")</small>") +
        "</div>"
      );
    };
    AddEvent(M.lumpRefill, "click", function () {
      if (M.magic < M.magicM) {
        Game.refillLump(1, function () {
          M.magic += 100;
          M.magic = Math.min(M.magic, M.magicM);
          PlaySound(
            "snd/pop" + Math.floor(Math.random() * 3 + 1) + ".mp3",
            0.75
          );
        });
      }
    });

    M.computeMagicM();
    M.magic = M.magicM;
    M.spellsCast = 0;
    M.spellsCastTotal = 0;

    //M.parent.switchMinigame(1);
  };
  M.save = function () {
    //output cannot use ",", ";" or "|"
    var str =
      "" +
      parseFloat(M.magic) +
      " " +
      parseInt(Math.floor(M.spellsCast)) +
      " " +
      parseInt(Math.floor(M.spellsCastTotal)) +
      " " +
      parseInt(M.parent.onMinigame ? "1" : "0");
    return str;
  };
  M.load = function (str) {
    //interpret str; called after .init
    //note : not actually called in the Game's load; see "minigameSave" in main.js
    if (!str) return false;
    var i = 0;
    var spl = str.split(" ");
    M.computeMagicM();
    M.magic = parseFloat(spl[i++] || M.magicM);
    M.spellsCast = parseInt(spl[i++] || 0);
    M.spellsCastTotal = parseInt(spl[i++] || 0);
    var on = parseInt(spl[i++] || 0);
    if (on && Game.ascensionMode != 1) M.parent.switchMinigame(1);
  };
  M.reset = function () {
    M.computeMagicM();
    M.magic = M.magicM;
    M.spellsCast = 0;
  };
  M.logic = function () {
    //run each frame
    if (Game.T % 5 == 0) {
      M.computeMagicM();
    }
    M.magicPS =
      Math.max(0.002, Math.pow(M.magic / Math.max(M.magicM, 100), 0.5)) * 0.002;
    M.magic += M.magicPS;
    M.magic = Math.min(M.magic, M.magicM);
    if (Game.T % 5 == 0) {
      for (var i in M.spells) {
        var me = M.spells[i];
        var cost = M.getSpellCost(me);
        l("grimoirePrice" + me.id).innerHTML = Beautify(cost);
        if (M.magic < cost)
          l("grimoireSpell" + me.id).className = "grimoireSpell titleFont";
        else
          l("grimoireSpell" + me.id).className =
            "grimoireSpell titleFont ready";
      }
    }
  };
  M.draw = function () {
    //run each draw frame
    if (Game.drawT % 5 == 0) {
      M.magicBarTextL.innerHTML =
        Math.min(Math.floor(M.magicM), Beautify(M.magic)) +
        "/" +
        Beautify(Math.floor(M.magicM)) +
        (M.magic < M.magicM
          ? " (" + loc("+%1/s", Beautify((M.magicPS || 0) * Game.fps, 2)) + ")"
          : "");
      M.magicBarFullL.style.width = (M.magic / M.magicM) * 100 + "%";
      M.magicBarL.style.width = M.magicM * 3 + "px";
      M.infoL.innerHTML = loc("Spells cast: %1 (total: %2)", [
        Beautify(M.spellsCast),
        Beautify(M.spellsCastTotal),
      ]);
    }
  };
  M.init(l("rowSpecial" + M.parent.id));
};
var M = 0;
