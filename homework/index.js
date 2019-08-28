'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => {
        reject(new Error('Network request failed'));
      };
      xhr.send();
    })
    
  }


  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function compare(a, b) {
    if (a.name<b.name){
      return -1;
    }
    if (a.name>b.name){
      return 1
    }
    return 0;
  }
  
  function main(url) {
    fetchJSON(url)
      .then(repositoryData => {
        const select = createAndAppend('select', root);
        // createAndAppend('option', select, { text: 'Click here to choose a Repository' });
      
        let alphabeticalSorting = repositoryData.sort(compare);
        alphabeticalSorting.forEach(repo => {
          const name = repo.name;
          createAndAppend('option', select, { text: name });
        });

        const repoInfo = createAndAppend('div', forRepoBlock);

        const contribs = createAndAppend('div', forContributorsBlock);
        select.addEventListener('change', evt => {
          const selectedRepo = evt.target.value;
          const repo = alphabeticalSorting.filter(r => r.name == selectedRepo)[0];
          // console.log(repo);
          repoInfo.innerHTML = '';
          contribs.innerHTML = '';

          const addInfo = (label, value) => {
            const container = createAndAppend('div', repoInfo);
            createAndAppend('span', container, { text: label });
            createAndAppend('span', container, { text: value });
          };
          addInfo('Name: ', repo.name);
          addInfo('Desciption: ', repo.description);
          addInfo('Number of forks: ', repo.forks);
          addInfo('Updated: ', new Date(repo.updated_at));

          const contribsUrl = repo.contributors_url;
          
          fetchJSON(contribsUrl)
          .then((contribData) => {
            contribData.forEach(contributor => {
              // createAndAppend('p', contribs, { text: 'hej'});
              createAndAppend('img', contribs, { src: contributor.avatar_url, height: 40, class: 'picture' });
              createAndAppend('span', contribs, { text: contributor.login, class: 'contributorName' });
              createAndAppend('span', contribs, { text: contributor.contributions, class: 'numberContributions'});
              createAndAppend('div', contribs, { text: '\n'});
            }); 
          })
          .catch((err) => { 
            const root = document.getElementById('root');
            createAndAppend('div', root, { text: err.message, class: 'alert-error' });
          })
        });
      })
      .catch((err) => { 
        const root = document.getElementById('root');
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      })
  } 
   

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}