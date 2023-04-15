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

> MAIN_DB_URI=mongodb+srv://oniksahakyan09:fN3FEshxnSuAqpa3@blockchain-listener.lvxiamo.mongodb.net/test  
> MAIN_DB_NAME=test  
> token=124421rq1  
> token=214dw2  
> Postman=https://api.postman.com/collections/13972954-da65b329-1d03-4da0-8701-2bcc5859fd58?access_key=PMAT-01GY22M0FT62K62YJCZZKBEBWV

# Task overview

Good day, Here I will describe what I did and why I did in that way.

The whole repository consists of 3 parts` Jobs, REST API and queries(also in API but still a bit different)

_P.S. you can also find basic task solution in basic folder_

### Jobs(DAI contract listener) | [Jobs](jobs)

> Ideally, this needs to be in another repository

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

### API | [Controllers](controllers)

There are 2 endpoints`

1. get transactions
2. get balance

#### Transactions endpoint has a few parameters that can be applied to change the response.

1. contractAddress - need to specify DAI contract to get response, otherwise it will
   throw an error. I did this way so adding another contract requires no additional work.
2. sender - wallet address of the sender
3. recipient - wallet address of the recipient
4. fromBlock and toBlock - the range
5. skip and limit - which works on transaction level, not the event level

So as said before I don't save transactions, I save events. This adds more flexibility,
which can be used later and also this fully covers the task. I use MongoDB for that, I had
a similar experience a while ago and working with NoSQL dbs can greatly improve the performance.

Additionally, if this would go to large scale, I would recommend moving everything to AWS S3, with exact partition
keys and that would be both cheap and fast, but at the moment I guess it's fine.



#### Balance endpoint has a few parameters that can be applied to change the response.

1. contractAddress - need to specify DAI contract to get response, otherwise -> error
2. address - wallet address
3. real(boolean) - This was not mentioned in the task, but I added this boolean to api, in case
   if you need to retrieve the real balance of the address


#### Token(Api key) is required to authenticate requesters and save in db some data

In this example I wrote a middleware([index.js](modules%2Fapi-limiter%2Findex.js)) which checks at the root,
and passes if the token exists. Before doing something(e.g. getting transactions), it checks and
updates token related info, to see if the token is valid or not. 

I also gave each `Request` a weight, so in future(if required), we can check by weights every request.
For example `get transaction` request requires a bit more resource, so it would be a bit expensive.  

P.S. Additionally see [Queries](routes%2Fqueries) route where I added a few queries as requested in task.

#### API limiter was added to handle large scale requests or DDOS

> Ideally it needs to be added or handled from Cloudflare or AWS or any similar service, as the
> requests still come to the server, but if it's handled from Cloudflare we can win some time and resource

I used `express-rate-limit` library to handle it on my side.



# What have I built ?

A service which listens to blockchain and records all DAI transactions. The service also
provides API to interact with it. It has 2 endpoints` Get Transactions and Get Balance.
To request a person needs to have a token(API key).

# What technologies did I use ?

1. Nodejs
2. MongoDB - best with working not structured data
3. Web3 
4. husky - pre-commit hook
5. dotenv - for process envs
6. express-rate-limit - for API throttling
7. jest - tests


# Your reasons for high-level decisions

Explained in each topic
