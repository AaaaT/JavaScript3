'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    this.setupDOMElements();

        // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element

    function compare(a, b) {
      if (a.name<b.name){
        return -1;
      }
      if (a.name>b.name){
        return 1
      }
      return 0;
    }

        
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.sort(compare).map(repo => new Repository(repo));
      this.addRepoNamesToSelect();    
    } catch (error) {
      this.renderError(error);
    }
  }

  addRepoNamesToSelect() {
    const selectElement = document.getElementById('repo-select');
    for (const repo of this.repos) {
      Util.createAndAppend('option', selectElement, { text: repo.name() });
    }
    selectElement.addEventListener('change', event => {
      const selectedRepoName = event.target.value;
      const selectedRepo = this.repos.filter(repo => repo.name() === selectedRepoName)[0];
      selectedRepo.render(document.getElementById('repo-info'));
      this.fetchContributorsAndRender(selectedRepo);
    });  

    let firstRepo = this.repos[0]
    firstRepo.render(document.getElementById('repo-info'));
    this.fetchContributorsAndRender(firstRepo);
  }

  setupDOMElements(){
    const root = document.getElementById('root');
    Util.createAndAppend('select', root, { id: 'repo-select' }); 
    Util.createAndAppend('div', root, { id: 'repo-info' }); 
    Util.createAndAppend('div', root, { id: 'repo-contributors' }); 
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  static clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(repo) {
    try {
      const contributors = await repo.fetchContributors();

      const container = document.getElementById('repo-contributors');
      App.clearContainer(container);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(container));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    console.log(error); // TODO: replace with your own code
  }
}

const REPOS_URL = 'https://api.github.com/orgs/foocoding/repos?per_page=100';

window.onload = () => new App(REPOS_URL);
