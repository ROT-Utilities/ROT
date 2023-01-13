scoreboard objectives add tick dummy
scoreboard objectives add cps dummy CPS

scoreboard players set test tick 20

scoreboard players add tick tick 1

execute if score tick tick = test tick run scoreboard players set @a cps 0
execute if score tick tick = test tick run scoreboard players set tick tick 0

execute as @a[scores={cps=1..}] run titleraw @s actionbar {"rawtext":[{"text":"§l§cCPS:§7 "},{"score":{"name":"*","objective":"cps"}}]}