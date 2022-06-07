# What is DOTS. Why is it important? 
DOTS is a combination of new technologies. It requires the programmer to think about code and data using data-oriented design (_DoD_) as opposed to the usual object-oriented.

- Enables you to take advantage of multicore processors to parallelize data processing and increase performance.
- Currently exists and works alongside MonoBehaviours, eventually Unity will move to a full-DOTS implementation.

## What is DOTS?
Unity's __Data-Oriented Tech Stack__ (__DOTS__) is a combination of technologies that work together to deliver a data-oriented approact to coding in Unity. This allows you to build projects that are better suiterd to your target hardware and therefore more performant.

__DOTS__ consists of the following elements:
	1. The Entitity Component System (ECS), which provides the framework for coding using a Data-Oriented approact. This is distributed through the __Entities__ package.
	2. The C# Job System, which provides a simple method of generating multithreaded code. This is distributed through the __Jobs__ package.
	3. The Burst Compiler, which generates fast and optimized native code. Availible throguh the __Burst__ package.
	4. Native Containers, which are ECS data structures that provide control over memory.

# Best Practices

# How To
- Install Entities & Jobs.
- ECS helps to write less and cleaner code.
- 