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
    const root = document.getElementById('root');
    Util.createAndAppend('h1', root, { text: 'REPOSITORES' });

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
      const repositoryData = await Util.fetchJSON(url);
      const select = Util.createAndAppend('select', root);
        // createAndAppend('option', select, { text: 'Click here to choose a Repository' });
      
        let alphabeticalSorting = repositoryData.sort(compare);
        alphabeticalSorting.forEach(repo => {
          const name = repo.name;
          Util.createAndAppend('option', select, { text: name });
        });

        const repoInfo = Util.createAndAppend('div', forRepoBlock);
        const contribs = Util.createAndAppend('div', forContributorsBlock);

        select.addEventListener('change', evt => {
          const selectedRepo = evt.target.value;
          const repo = alphabeticalSorting.filter(r => r.name == selectedRepo)[0];
          getRepoData(repo, repoInfo, contribs); 
        });

        let firstRepo = alphabeticalSorting[0]
        getRepoData(firstRepo, repoInfo, contribs); 
    }
    catch(err) {
      const root = document.getElementById('root');
      Util.createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }  
    




    async function getRepoData(repo, repoInfo, contribs) {
      repoInfo.innerHTML = '';
      contribs.innerHTML = '';
  
      const addInfo = (label, value) => {
        const container = Util.createAndAppend('div', repoInfo);
        Util.createAndAppend('span', container, { text: label });
        Util.createAndAppend('span', container, { text: value });
      };
      addInfo('Name: ', repo.name);
      addInfo('Desciption: ', repo.description);
      addInfo('Number of forks: ', repo.forks);
      addInfo('Updated: ', new Date(repo.updated_at));
  
      const contribsUrl = repo.contributors_url;
      try {
        const contribData = await Util.fetchJSON(contribsUrl);
        contribData.forEach(contributor => {
          // createAndAppend('p', contribs, { text: 'hej'});
          Util.createAndAppend('img', contribs, { src: contributor.avatar_url, height: 40, class: 'picture' });
          Util.createAndAppend('span', contribs, { text: contributor.login, class: 'contributorName' });
          Util.createAndAppend('span', contribs, { text: contributor.contributions, class: 'numberContributions'});
          Util.createAndAppend('div', contribs, { text: '\n'});
        }); 
      }
      catch(err) { 
        const root = document.getElementById('root');
        Util.createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      }
    }






    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      // TODO: add your own code here
    } catch (error) {
      this.renderError(error);
    }
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
  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      const container = document.getElementById('container');
      App.clearContainer(container);

      const leftDiv = Util.createAndAppend('div', container);
      const rightDiv = Util.createAndAppend('div', container);

      const contributorList = Util.createAndAppend('ul', rightDiv);

      repo.render(leftDiv);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
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

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);