# Q-learning Pong game

This is a simple Pong game JavaScript. The player on the left (the rl agent) is trained using Q-learning by playing against an optimal opponent. The user can adjust the learning rate ($\alpha$), the discount factor ($\gamma$), the exploration rate ($\epsilon$), the number of episodes en the number of steps in each episode. After training the rl agent, you can play the agent yourself.

## Q-learning

The rl agent learns using a simple Q-learning algorithm that uses a Q-table as value function. This table has a row for each state and a column for each action.

The states are defined by the combination of the y-position of the ball and the y-position of the pallet of the rl agent. Since there are 16 vertical pixels and the pallet is 3 pixels high, the Q-table contains 16*14 rows. 

The actions are: pallet up, no movement, pallet down. Consequently, the Q-table contains 3 columns.

The following rewards are given to the rl agent:
- When the rl agent looses the game, this happens when the ball hits the left side of the screen, the agent is given a reward of -100.
- When the rl agent hits the ball, it is given a reward of 10.

In each step, the values in the Q-table are updated according to the following formula.

$$
Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha\left[R_{t+1} + \gamma \max_{a}Q(S_{t+1}, a) - Q(S_t, A_t)\right]
$$


In general, algorithm chooses the action with the highest possible reward of all actions in the current state. However, it select a random action with a probability of $\epsilon$.