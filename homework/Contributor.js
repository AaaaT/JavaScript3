'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} container The container element in which to render the contributor.
   */
  render(container) {
    Util.createAndAppend('img', container, {src: this.contributor.avatar_url, width: 30} );
    Util.createAndAppend('p', container, {text: this.contributor.login} );
  }
}
