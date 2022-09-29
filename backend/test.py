import itertools

a = [1, 2, 3, 4, 5, 6]
turns = itertools.cycle(a)
print(next(turns))
print(next(turns))
print(next(turns))
print(next(turns))
print(next(turns))
print(next(turns))

a.remove(6)
nextcard = next(turns)
i = a.index(nextcard) + 1
newa = a[i:] + a[:i]
print(newa, a, nextcard)
turns = itertools.cycle(newa)
print(next(turns))
print(next(turns))
print(next(turns))
print(next(turns))
print(next(turns))
print(next(turns))