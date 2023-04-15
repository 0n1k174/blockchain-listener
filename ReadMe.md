# Task

- Create an Application / API that interacts with the DAI smart contract and has the following properties:

    1. Stores the latest DAI transactions into a DB on a continuous basis (block per block). - done
       Note: it is not required to index past DAI transactions (before today).

- Create an REST API that returns the following data (from the DB):

  1. Last 100 DAI transactions (add pagination, if possible) - done
  2. Transactions by sender or recipient - done
  3. Address' DAI balance (sender or recipient) from indexed transactions / aggregated data only - done

- API requirements:

  1. Limit the API usage (API key - the key/s can be mocked) - done
  2. Log API requests - done
  3. (Bonus) Anticipate large amounts of requests - implement API throttling - done

- Write basic tests.


- (Bonus) Write simple SQL queries to get the following data.

    1. AVG number of requests per specific timeframe - done
    2. Sum of all request in specific time frame - done
    3. 3 hour time period for specific api key, when the usage is the highest (Example: 3:00pm to 6:00pm) - done
    4. Most used API key (with num of req) - done


- Write a high-level description (1 page) explaining your solution. Explanation should include:

    1. A description of what you've built
    2. Which technologies you've used and how they tie together
    3. Your reasons for high-level decisions


# Useful secrets

>MAIN_DB_URI=mongodb+srv://oniksahakyan09:fN3FEshxnSuAqpa3@blockchain-listener.lvxiamo.mongodb.net/test  
>MAIN_DB_NAME=test  
>token=124421rq1  
>token=214dw2

# Task overview

Good day, Here I will describe what I did and why I did in that way.

The whole repository consists of 3 parts` Jobs, REST API  and queries(also in API but still a bit different)

_P.S. you can also find basic task solution in basic folder_ 


### Jobs(DAI contract listener) | [Jobs](jobs)

>Ideally, this needs to be in another repository

The task was to write a function which will listen to DAI contract and will insert all the
new transactions to database.

I choose to do this` 

I am listening to DAI contract for `allEvents` and once an event occurs, I parse(bind) it
and store in database. In this way we don't have the full transaction but know exactly what 
happened in which transaction, so creating a transaction from these events is the easiest part,
I simply group them with hash. The function is creating a collection(table) in the database
with `Events_contractAddress`(always lowercase contractAddress), so in order listening to another
contract which has the same `ABI.json` as DAI, you just need to call the function with the other 
smart contract address.

_I did not finish onError part as it requires a bit of discussion, it's up to you to say what should be 
the function behaviour once it throws error, at this moment it will just continue to listen._
