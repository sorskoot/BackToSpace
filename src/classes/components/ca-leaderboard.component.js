/*
Copyright © 2020 Vhite Rabbit <contact@vhiterabbit.com>
Copyright © 2020 Florian Isikci <florian.isikci@vhiterabbit.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/
/**
 * @brief Construct Arcade Leaderboard
 *
 * Allows display and score submission of and to Construct Arcade
 * leaderboards.
 *
 * @ref schema.leaderboardId is the leaderboard id for your specific
 * game. If you don't have one yet, make sure to request one on the
 * Construct Arcade Discord channel: https://discord.gg/zU6EkGGü
 */
export default AFRAME.registerComponent("ca-leaderboard", {
  schema: {
    /** Construct Arcade SDK leaderboard id */
    leaderboardId: { type: "string", default: "" },
    /** Font file */
    fontSrc: { type: "string", default: "" },
    /** Text color */
    textColor: { type: "color", default: "#FFF" },
    textColor2: { type: "color", default: "#FFF" },
    textColor3: { type: "color", default: "#FFF" },    
    textColor4: { type: "color", default: "#FFF" },    
    /** Text font size */
    textWidth: { type: "number", default: 1.5 },
    /** Horizontal spacing between rank, name and score columns */
    horizontalSpacing: { type: "number", default: 0 },
    /** Vertical spacing between leaderboard entries */
    verticalSpacing: { type: "number", default: 0 },
    /**
     * The leaderboards only store integer values. To achieve floating point values
     * for currencies and time, you can set a multiplier here to divide on retrieve
     * and multiply on set
     */
    scoreStorageMultiplicator: { type: "number", default: 1.0 },
    /** Text to display above the leaderboard table */
    title: { type: "string", default: "Top earning coffee houses:" },
    /** Display debug data */
    debug: { type: "boolean", default: false },
  },

  /**
   * @summary Submit score.
   *
   * Opens popup for user to login if not logged in already.
   */
  submitScore: function(score) {
    /* Math.floor seems necessary to guarantee integral value */
    if ("casdk" in window) {
      let submissionScore = Math.round(score * this.data.scoreStorageMultiplicator);
      return casdk
        .submitScore(this.data.leaderboardId, submissionScore)
        .then(() => {
          console.log("Score submitted");
          if(this.el.getAttribute('text__login'))
            this.el.removeAttribute('text__login');
          /* Give the server some time to update */
          setTimeout(this.getLeaderboard.bind(this), 2000);
        });
    }
  },

  /**
   * @summary Request an update of the leaderboard entries.
   *
   * This is already done after @ref submitScore()
   */
  getLeaderboard: function() {
    if (!("casdk" in window)) {
        if (this.data.debug) {
            this.el.setAttribute('text__login', {
              value: "\n\n\n\n\n\n(login to submit score on game over)",
              color: this.data.textColor4,
              font: this.data.fontSrc,
              width: this.data.textWidth/2,
              align: "center",
              baseline: "top",
              lineHeight: this.data.verticalSpacing*2,
            });
            /* Simulate a delayed request return */
            setTimeout(() => {
                const s = this.data.scoreStorageMultiplicator;
                this.onScoresRetrieved([
                    {rank: 0, displayName: "User", score: 100*s},
                    {rank: 1, displayName: "Player", score: 78*s},
                    {rank: 2, displayName: "Bot", score: 34*s},
                    {rank: 3, displayName: "Debugger", score: 12*s},
                    {rank: 4, displayName: "Test", score: 2*s},
                ]);
            }, 1000);
        }
        return;
    }
    casdk.getLeaderboard(this.data.leaderboardId).then(r => {
      this.onScoresRetrieved(r.leaderboard);
    });

    if(casdk.isLoggedIn()) {
      this.el.setAttribute('text__login', {
        value: "\n\n\n\n\n\n(login to submit score on game over)",
        color: this.data.textColor4,
        font: this.data.fontSrc,
        width: this.data.textWidth/2,
        align: "center",
        baseline: "top",
        lineHeight: this.data.verticalSpacing*2,
      });
      // TODO: Add login to submit text here
    }
  },

  onScoresRetrieved: function(scores) {
    if (scores == null) {
      console.warn("Retrieving scores failed.");
      return;
    }

    let leftText = "\n";
    let centerText = this.data.title + "\n";
    let rightText = "\n";

    for (let i = 0; i < Math.min(5, scores.length); i++) {
      const rank = (scores[i].rank + 1) + "\n";
      const name = (scores[i].displayName || "unknown") + "\n";
      const score = (scores[i].score / this.data.scoreStorageMultiplicator) + "\n";

      leftText += rank;
      centerText += name;
      rightText += score;
    }

    this.el.setAttribute("text__left", "value", leftText);
    this.el.setAttribute("text__center", "value", centerText);
    this.el.setAttribute("text__right", "value", rightText);
    this.el.object3D.visible = true;
    console.log("Leaderboard updated");
  },
  init: function() {
    this.loaded = false;

    this.el.setAttribute("text__left", {
      color: this.data.textColor,
      font: this.data.fontSrc,
      width: this.data.textWidth,
      align: "left",
      baseline: "top",
      xOffset: -this.data.horizontalSpacing,
      lineHeight: this.data.verticalSpacing,
    });

    this.el.setAttribute("text__center", {
      color: this.data.textColor2,
      font: this.data.fontSrc,
      width: this.data.textWidth,
      align: "center",
      baseline: "top",
      lineHeight: this.data.verticalSpacing,
    });

    this.el.setAttribute("text__right", {
      color: this.data.textColor3,
      font: this.data.fontSrc,
      width: this.data.textWidth,
      align: "right",
      baseline: "top",
      xOffset: this.data.horizontalSpacing,
      lineHeight: this.data.verticalSpacing,
    });

    if ("casdk" in window || this.data.debug) {
      if (!this.loaded) {
        this.loaded = true;
        this.getLeaderboard(this.data.leaderboardId);
      }
    }
  },
});
