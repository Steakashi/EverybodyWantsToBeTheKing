# Glossary

Refer to this glossary when developping for the application.

- **Action** : refer to the action that the player has chosen to make in the round. An Action include an emitter, one or multiple targets, and one or multiple receivers.
    - **Emitter** : the player who initiate an action.
    - **Target** : the player targeted by an emitter when selecting / processing an action.
    - **Receiver** : the player which will benefit from a previously processed action.
- **Round** : a sequence of steps involving all players in game, from the choice of theirs actions to their resolutions, until all players are allowed to choose a new action.
Precise sequence is as following : turn, progress, resolution, end.
    - **Turn** : First step of round where the player choose his action.
    - **Progress** : Second step of round where all actions are processed in a specific order, depending of players characteristics and actions themselves.
    - **Resolution** : Third step of round where all actions results are exposed to all players.
    - **End** : Final step of round, where non-explicit or not related to players actions are processed.    