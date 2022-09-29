import itertools

users = ['prueba4', 'prueba 1', 'prueba2', 'prueba3']
cycle = itertools.cycle(users)

next(cycle)
turn = next(cycle)
target = next(cycle)
for _ in range(len(users) - 1):
  print(next(cycle))
print(target, next(cycle))