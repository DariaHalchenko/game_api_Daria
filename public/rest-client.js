const vue = Vue.createApp({
    data() {
        return {
            gameInModal: {},
            games: [],
            newGame: {
                name: '',
                price: ''
            }
        }
    },
    async created() {
        this.games = await (await fetch('http://localhost:8080/games')).json();
    },
    methods: {
        async getGame(id) {
            this.gameInModal = await (await fetch(`http://localhost:8080/games/${id}`)).json();
            let gameInfoModal = new bootstrap.Modal(document.getElementById('gameInfoModal'), {});
            gameInfoModal.show();
        },
        async addGame() {
            try {
                const response = await fetch('http://localhost:8080/games', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.newGame)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert('Error: ' + errorData.message);
                    return;
                }

                const addedGame = await response.json();
                this.games.push(addedGame); // добавляем в список игр

                // Очистка формы
                this.newGame.name = '';
                this.newGame.price = '';
            } catch (error) {
                alert('Failed to add game: ' + error.message);
            }
        }
    }
}).mount('#app');
