import Component from '@glimmer/component';
import config from 'ghost-admin/config/environment';
import semver from 'semver';
import {inject} from 'ghost-admin/decorators/inject';
import {inject as service} from '@ember/service';

export default class AboutModal extends Component {
    @service upgradeStatus;

    @inject config;

    constructor() {
        super(...arguments);
        if (this.isTesting === undefined) {
            this.isTesting = config.environment === 'test';
        }
    }

    get copyrightYear() {
        const date = new Date();
        return date.getFullYear();
    }

    get linkToGitHubReleases() {
        if (this.config.version.includes('-pre.')) {
            try {
                const semverVersion = semver.parse(this.config.version, {includePrerelease: true});

                // Ensure this follows our prerelease format
                if (semverVersion
                    && semverVersion.prerelease?.[0] === 'pre'
                    && semverVersion.prerelease?.[1]
                    && Number.isInteger(semverVersion.prerelease?.[2])
                ) {
                    return `https://github.com/TryGhost/Ghost/commit/${semverVersion.prerelease[1]}`;
                }

                return false;
            } catch (e) {
                return false;
            }
        }

        return `https://github.com/TryGhost/Ghost/releases/tag/v${this.config.version}`;
    }

    get showSystemInfo() {
        const isPro = !!this.config.hostSettings?.siteId;

        // Don't show any system info for Pro
        if (isPro) {
            return false;
        }

        return true;
    }

    get showDatabaseWarning() {
        const isProduction = !!this.config.environment.match?.(/production/i);
        const database = this.config.database;

        // Show a warning if we're in production and not using MySQL 8
        if (isProduction && database !== 'mysql8') {
            return true;
        }

        // Show a warning if we're in development and using MySQL 5
        if (!isProduction && database === 'mysql5') {
            return true;
        }

        return false;
    }
}
