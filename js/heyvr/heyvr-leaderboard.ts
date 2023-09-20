import {Component, Object3D, TextComponent} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {GlobalScore} from '../../heyVRsdk.js';

export class HeyvrLeaderboard extends Component {
    static TypeName = 'heyvr-leaderboard';

    @property.string('')
    leaderboardId = '';

    @property.int(10)
    amountScoresDisplayed = 10;

    @property.object({required: true})
    lastScoreDisplay!: Object3D;

    @property.object({required: true})
    textColumn1Object!: Object3D;
    @property.object({required: true})
    textColumn2Object!: Object3D;
    @property.object({required: true})
    textColumn3Object!: Object3D;

    @property.bool(false)
    debug = false;

    private loaded = false;
    private firstColumn?: TextComponent;
    private secondColumn?: TextComponent;
    private thirdColumn?: TextComponent;
    private lastScoreDisplayText?: TextComponent;

    init() {
        this.debug = false;
        this.loaded = false;

        this.firstColumn = this.textColumn1Object.getComponent(TextComponent)!;
        this.secondColumn = this.textColumn2Object.getComponent(TextComponent)!;
        this.thirdColumn = this.textColumn3Object.getComponent(TextComponent)!;
        if (this.lastScoreDisplay) {
            this.lastScoreDisplayText = this.lastScoreDisplay.getComponent(TextComponent)!;
        }

        if ('heyVR' in window || this.debug) {
            if (!this.loaded) {
                this.loaded = true;
                this.getLeaderboard().catch(console.error);
            }
        }
    }

    async submitScore(score: number) {
        if (this.lastScoreDisplayText) {
            this.lastScoreDisplayText.text = 'Last score: ' + score;
            this.lastScoreDisplayText.active = true;
        }
        if ('heyVR' in window) {
            const success = await window.heyVR.leaderboard.postScore(
                this.leaderboardId,
                score
            );
            if (success) {
                await this.getLeaderboard();
            }
        } else if (this.debug) {
            this.firstColumn!.text = '';
            this.secondColumn!.text = 'Loading...';
            this.thirdColumn!.text = '';
            setTimeout(() => {
                this.getLeaderboard().catch(console.error);
            }, 2000);
        }
    }

    /**
     * @summary Request an update of the leaderboard entries.
     *
     * This is already done after @ref submitScore()
     */
    async getLeaderboard() {
        if (!('heyVR' in window)) {
            return;
        }

        this.firstColumn!.text = '';
        this.secondColumn!.text = 'Loading...';
        this.thirdColumn!.text = '';

        const result = await window.heyVR.leaderboard.get(
            this.leaderboardId,
            this.amountScoresDisplayed
        );
        this.onScoresRetrieved(result);
    }

    onScoresRetrieved(scores: GlobalScore[]) {
        if (scores == null) {
            console.warn('Retrieving scores failed.');
            return;
        }
        let leftText = '\n';
        let centerText = '\n';
        let rightText = '\n';

        for (let i = 0; i < Math.min(this.amountScoresDisplayed, scores.length); i++) {
            const rank = i + 1 + '\n';
            const name = (scores[i].user || 'unknown') + '\n';
            const score = scores[i].score + '\n';

            leftText += rank;
            centerText += name;
            rightText += score;
        }

        this.firstColumn!.text = leftText;
        this.secondColumn!.text = centerText;
        this.thirdColumn!.text = rightText;
    }
}
