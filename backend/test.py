import itertools

users = ['prueba4', 'prueba 1', 'prueba2', 'prueba3']
cycle = itertools.cycle(users)

print(next(cycle))
print(next(cycle))
print(next(cycle))
print(next(cycle))
print(next(cycle))
print(next(cycle))