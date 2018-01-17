import 'normalize.css';
import '../styles/main.scss';
import allFriendsTemplate from '../templates/parts/all-friends.hbs';
import favoriteFriendsTemplate from '../templates/parts/favorite-friends.hbs';

function isMatching(full, chunk) {

    return full.toLowerCase().includes(chunk.toLowerCase());
}

VK.init({
    apiId: 5267932
});

function auth() {

    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

function callApi(method, params) {
    params.v = '5.69';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    });
}

(async () => {
    try {
        await auth();
        let friends = await callApi('friends.get', {fields: 'photo_50'});
        let favoriteFriendsArr = [];
        let allFriendsUl = document.querySelector('#allFriends');
        let favoriteFriendsUl = document.querySelector('#favoriteFriends');

        allFriendsUl.innerHTML = allFriendsTemplate(friends);
        addAllFriendsListeners();
        addAllFriendsDragListeners();
        addFavoriteFriendsListeners();
        addFavoriteFriendsDragListeners();

        //---------allSearch--------//
        let allSearch = document.querySelector('#allSearch');

        allSearch.addEventListener('keyup', () => {
            let value = allSearch.value;

            if (value === '') {
                allSearch.style.backgroundColor = 'white';
                allFriendsUl.innerHTML = allFriendsTemplate(friends);
                addAllFriendsListeners();
                addAllFriendsDragListeners();
            } else {
                allSearch.style.backgroundColor = '#E45128';
                let filteredAllFriends = [];

                friends.items.forEach(obj => {
                    if (isMatching(obj.first_name, value) || isMatching(obj.last_name, value)) {
                        filteredAllFriends.push(obj);
                    }
                });
                allFriendsUl.innerHTML = allFriendsTemplate({items: filteredAllFriends});
                addAllFriendsListeners();
                addAllFriendsDragListeners();
            }
        });
        //-------favoriteSearch-------//
        let favoriteSearch = document.querySelector('#favoriteSearch');

        favoriteSearch.addEventListener('keyup', () => {

            let value = favoriteSearch.value;
            if (value === '') {
                favoriteSearch.style.backgroundColor = 'white';
                favoriteFriendsUl.innerHTML = favoriteFriendsTemplate({items: favoriteFriendsArr});
                addFavoriteFriendsListeners();
                addFavoriteFriendsDragListeners();
            } else {
                favoriteSearch.style.backgroundColor = '#E45128';
                let filteredFavoriteFriends = [];

                favoriteFriendsArr.forEach(obj => {
                   if (isMatching(obj.first_name, value) || isMatching(obj.last_name, value)) {
                       filteredFavoriteFriends.push(obj);
                   }
                });
                favoriteFriendsUl.innerHTML = favoriteFriendsTemplate({items: filteredFavoriteFriends});
                addFavoriteFriendsListeners();
                addFavoriteFriendsDragListeners();
            }
        });
        //-------dragToFavorite------//
        function addAllFriendsDragListeners() {
            let allFriendsItems = document.querySelectorAll('.all-friends__item');

            for (let allFriendsItem of allFriendsItems) {
                allFriendsItem.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', e.target.id);
                });
            }
            favoriteFriendsUl.addEventListener('dragover', (e) => {
               if (e.preventDefault) e.preventDefault();

               return false;
            });
            favoriteFriendsUl.addEventListener('drop', (e) => {
                if (e.stopPropagation) e.stopPropagation();

                let draggableItemId = e.dataTransfer.getData('text');
                let draggableItem = document.getElementById(draggableItemId);

                if (draggableItem.classList.contains('all-friends__item')) {
                    friends.items.forEach((obj, index) => {
                       if (obj.id == draggableItemId) {
                           favoriteFriendsArr.unshift(obj);
                           draggableItem.remove();
                           friends.items.splice(index, 1);
                       }
                    });
                    favoriteFriendsUl.innerHTML = favoriteFriendsTemplate({items: favoriteFriendsArr});
                    addFavoriteFriendsListeners();
                    addFavoriteFriendsDragListeners();
                    favoriteSearch.dispatchEvent(new Event('keyup'));
                }

                return false;
            });
        }
        //-------dragToAll------//
        function addFavoriteFriendsDragListeners() {
            let favoriteFriendsItems = document.querySelectorAll('.favorite-friends__item');

            for (let favoriteFriendsItem of favoriteFriendsItems) {
                favoriteFriendsItem.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', e.target.id);
                });
            }
            allFriendsUl.addEventListener('dragover', (e) => {
                if (e.preventDefault) e.preventDefault();

                return false;
            });
            allFriendsUl.addEventListener('drop', (e) => {
                if (e.stopPropagation) e.stopPropagation();

                let draggableItemId = e.dataTransfer.getData('text');
                let draggableItem = document.getElementById(draggableItemId);

                if (draggableItem.classList.contains('favorite-friends__item')) {
                    favoriteFriendsArr.forEach((obj, index) => {
                        if (obj.id == draggableItemId) {
                            friends.items.unshift(obj);
                            draggableItem.remove();
                            favoriteFriendsArr.splice(index, 1);
                        }
                    });
                    allFriendsUl.innerHTML = allFriendsTemplate(friends);
                    addAllFriendsListeners();
                    addAllFriendsDragListeners();
                    allSearch.dispatchEvent(new Event('keyup'));
                }

                return false;
            });
        }

        //-------moveToFavorite------//
        function addAllFriendsListeners() {
            let allFriendsItems = document.querySelectorAll('.all-friends__item');

            for (let allFriendsItem of allFriendsItems) {
                allFriendsItem.addEventListener('click', (e) => {
                    let item = e.currentTarget;

                    if (e.target.classList.contains('all-friends__button-icon')) {
                        friends.items.forEach((obj, index) => {
                            if (obj.id == item.id) {
                                favoriteFriendsArr.unshift(obj);
                                item.remove();
                                friends.items.splice(index, 1);
                            }
                        });
                        favoriteFriendsUl.innerHTML = favoriteFriendsTemplate({items: favoriteFriendsArr});
                        addFavoriteFriendsListeners();
                        favoriteSearch.dispatchEvent(new Event('keyup'));
                    }
                });
            }
        }

        //-------moveToAll------//
        function addFavoriteFriendsListeners() {
            let favoriteFriendsItems = document.querySelectorAll('.favorite-friends__item');

            for (let favoriteFriendsItem of favoriteFriendsItems) {
                favoriteFriendsItem.addEventListener('click', (e) => {
                    let item = e.currentTarget;

                    if (e.target.classList.contains('favorite-friends__button-icon')) {
                        favoriteFriendsArr.forEach((obj, index) => {
                            if (obj.id == item.id) {
                                friends.items.unshift(obj);
                                item.remove();
                                favoriteFriendsArr.splice(index, 1);
                            }
                        });
                        allFriendsUl.innerHTML = allFriendsTemplate(friends);
                        addAllFriendsListeners();
                        allSearch.dispatchEvent(new Event('keyup'));
                    }
                });
            }
        }

    } catch (e) {
        console.error(e);
    }
})();



