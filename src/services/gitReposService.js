const axios = require('axios');
const debug = require('debug')('app:gitReposService');



function gitReposService() {

    const resultsPerPage = 10;

    // NOTE: Pages na github apito se 1 based, ne 0 based

    // token not required
    function searchGitRepos(term, numPage) {

        return new Promise((resolve) => {
            axios.get('https://api.github.com/search/repositories', {
                params: {
                    q: term,
                    sort: 'forks',
                    page: numPage,
                    per_page: resultsPerPage
                }
            }).then((resp) => {
                // debug(resp.data.items);

                const novaNiza = [];
                resp.data.items.forEach(element => {
                    novaNiza.push({
                        name: element.name,
                        html_url: element.html_url,
                        description: element.description,
                        url: element.url,
                        commits_url: element.commits_url,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                        pushed_at: element.pushed_at,
                        forks: element.forks,
                        language: element.language,
                        size: element.size,
                        
                        owner_username: element.owner.login,
                        owner_url: element.owner.html_url,
                        owner_reposUrl: element.owner.repos_url
                    });
                });

                resolve(novaNiza);
            }).catch(err => {
                debug(err);
            });
        });
    }

    function getConcreteGitRepo(username, gitRepoName) {
        return new Promise((resolve) => {
            axios.get(`https://api.github.com/repos/${username}/${gitRepoName}`).then((resp) => {
                resolve(resp.data);
            }).catch(err => {
                debug(err);
                // reject();
            });
        });
    }

    function searchGitUsers(term, numPage) {
        return new Promise((resolve, reject) => {
            axios.get('https://api.github.com/search/users', {
                params: {
                    q: term,
                    page: numPage,
                    per_page: resultsPerPage
                }
            }).then((resp) => {
                resolve(resp.data);
            }).catch(err => {
                debug(err);
                reject();
            });
        });
    }

    function getUserRepos(username, numPage) {
        return new Promise((resolve, reject) => {
            axios.get(`https://api.github.com/users/${username}/repos`, {
                params: {
                    page: numPage,
                    per_page: resultsPerPage
                }
            }).then((resp) => {
                resolve(resp.data);
            }).catch(err => {
                debug(err);
                reject();
            });
        });
    }

    function getCommitsFromRepo(username, gitRepoName) {
        return new Promise((resolve, reject) => {
            axios.get(`https://api.github.com/repos/${username}/${gitRepoName}/commits`).then(resp => {
                resolve(resp.data);
            }).catch(err => {
                debug(err);
                reject();
            });
        });
    }

    // token required
    // NOTE: Raboti i vaka, ne mora so promises kako gornite metodi, tuku so async/await
    const getGitReposOfLoggedInUser = async (req) => {
        let response = null;
        await axios.get('https://api.github.com/user/repos', {
            headers: {
                authorization: `token ${req.session.userToken}`,
                accept: 'application/vnd.github.v3+json'
            }
        }).then(resp => {
            // return resp.data;
            response = resp.data;
        }).catch(err => {
            debug(err);
            response = 'Cannot get the repos of the logged in user';
        });

        return response;
    };

    const createGitRepo = async (req) => {

        const { name, description, isPrivate } = req.body;

        let response = null;

        await axios.post('https://api.github.com/user/repos', {
             name,
             description,
             private: isPrivate
        }, 
        {
            headers: {
                authorization: `token ${req.session.userToken}`,
                accept: 'application/vnd.github.v3+json'
            }
        }).then(resp => {
            response = resp.data;
            debug(response);
        }).catch(err => {
            debug(err);
            response = 'Cannot create the repo';
        });

        return response;
    };


    return {
        searchGitRepos,
        getConcreteGitRepo,
        searchGitUsers,
        getUserRepos,
        getCommitsFromRepo,
        getGitReposOfLoggedInUser,
        createGitRepo
    };
}


module.exports = gitReposService();

