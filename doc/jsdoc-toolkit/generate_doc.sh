echo "Generating documentation for server.js"
java -jar jsrun.jar app/run.js -a -p -t=templates/jsdoc /home/emil/pop/SketchO-/server.js -d=/home/emil/Downloads/jsdoc_toolkit-2.4.0/jsdoc-toolkit/out/jsdoc/server
echo "Done."
echo "Generating documentation for client.js"
java -jar jsrun.jar app/run.js -a -p -t=templates/jsdoc  /home/emil/pop/SketchO-/client.js -d=/home/emil/Downloads/jsdoc_toolkit-2.4.0/jsdoc-toolkit/out/jsdoc/client
echo "Done."
echo "Generating documentation for worker.js"
java -jar jsrun.jar app/run.js -a -p -t=templates/jsdoc  /home/emil/pop/SketchO-/scripts/worker.js -d=/home/emil/Downloads/jsdoc_toolkit-2.4.0/jsdoc-toolkit/out/jsdoc/worker
echo "Done."
sleep 1
firefox out/index.html &

