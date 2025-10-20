const vue = Vue.createApp({
    data() {
        return {
            gameInModal: {},
            games: [],
            newGame: {
                name: '',
                price: ''
            },
            searchId: '',
            foundGame: null
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
        //uue mängu lisamine
        async addGame() {
            try {
                //saadame POST-päringu uue mängu lisamiseks
                const res = await fetch('http://localhost:8080/games', {
                    method: 'POST',
                    headers: {
                        //andmed JSON-vormingus
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(this.newGame)
                });
                //päringu edukuse kontrollimine
                if (!res.ok) {
                    const errorData = await res.json();
                    alert(errorData.message);
                    return;
                }
                //saame andmed lisatud mängu kohta
                const addedGame = await res.json();
                this.games.push(addedGame); //lisame uue mängu mängude nimekirja
                // vormi puhastamine
                this.newGame.name = '';
                this.newGame.price = '';
            } 
            catch (error) {
                alert(error.message);
            }
        },
        //mängu eemaldamine ID järgi
        async deleteGame(id) {
            try {
                //saadame DELETE-päringu
                const res = await fetch(`http://localhost:8080/games/${id}`, {
                    method: 'DELETE'
                });
                //päringu edukuse kontrollimine
                if (!res.ok) {
                    const errorData = await res.json();
                    alert(errorData.message);
                    return;
                }
                //eemaldame mängu massiivist 
                this.games = this.games.filter(game => game.id !== id);
            } 
            catch (error) {
                alert(error.message);
            }
        },
        // otsib mängu ID järgi
        async searchGameById() {
            try {
                const res = await fetch(`http://localhost:8080/games/${this.searchId}`);
                //päringu edukuse kontrollimine
                if (!res.ok) {
                    const errorData = await res.json();
                    alert(errorData.message);
                    this.foundGame = null;
                    return;
                }
                this.foundGame = await res.json();
            } 
            catch (error) {
                alert(error.message);
            }
        },
        // mängu uuendamine (PUT)
        async updateGame() {
            try {
                //saadame PUT-päringu
                const res = await fetch(`http://localhost:8080/games/${this.gameInModal.id}`, {
                    method: 'PUT',
                    headers: {
                        //andmed JSON-vormingus
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.gameInModal)
                });
                //päringu edukuse kontrollimine
                if (!res.ok) {
                    const errorData = await res.json();
                    alert(errorData.message);
                    return;
                }
                const updatedGame = await res.json();
                //uuendame mängude nimekirja  
                const index = this.games.findIndex(g => g.id === updatedGame.id);
                if (index !== -1) {
                    this.games.splice(index, 1, updatedGame);
                }
                alert('Game updated successfully!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('gameInfoModal'));
                modal.hide();
            } 
            catch (error) {
                alert(error.message);
            }
        }
    }
}).mount('#app');
