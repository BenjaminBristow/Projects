import java.awt.*;
import java.awt.event.*;
import java.util.HashMap;
import javax.swing.*;

public class GUI extends JFrame implements ActionListener {
    HashMap<String, Station> allStations;
    JTextField startField;
    JTextField destField;
    JTextArea resultArea;
    JButton fastestRouteButton;
    JButton fewestChangesButton;

    public GUI(HashMap<String, Station> allStations) {
        this.allStations = allStations;
        setTitle("Manchester Metrolink Route Planner");
        setSize(700, 300);
        setLayout(new BorderLayout()); 
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // input panels
        JPanel inputPanel = new JPanel();
        inputPanel.setLayout(new GridLayout(4, 1, 10, 10));
        inputPanel.setPreferredSize(new Dimension(300, 200));

        startField = new JTextField();
        destField = new JTextField();

        JPanel buttonPanel = new JPanel(); 
        buttonPanel.setLayout(new FlowLayout());
        fastestRouteButton = new JButton("Find Fastest Route");
        fewestChangesButton = new JButton("Find Fewest Changes");
        
        // add a listener to button and button to button panel
        fastestRouteButton.addActionListener(this);
        buttonPanel.add(fastestRouteButton);
        fewestChangesButton.addActionListener(this);
        buttonPanel.add(fewestChangesButton);

        inputPanel.add(new JLabel("  Start Station:"));
        inputPanel.add(startField);
        inputPanel.add(new JLabel("  Destination:"));
        inputPanel.add(destField);

        // output panel
        resultArea = new JTextArea();
        resultArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(resultArea); // Adds scrollbars

        // add panels to frame
        add(inputPanel, BorderLayout.WEST);
        add(scrollPane, BorderLayout.CENTER);
        add(buttonPanel, BorderLayout.SOUTH);

        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        
        // verify stations exist
        String sourceStation = startField.getText().trim().toLowerCase();
        String destinationStation = destField.getText().trim().toLowerCase();
        if (!allStations.containsKey(sourceStation)) {
            resultArea.setText("Error: Starting station '" + sourceStation + "' not found.");
            return;
        }
        if (!allStations.containsKey(destinationStation)) {
            resultArea.setText("Error: Destination '" + destinationStation + "' not found.");
            return;
        }

        // then choose the button
        if (e.getSource() == fastestRouteButton) {
            resultArea.setText("Searching for route from " + sourceStation + " to " + destinationStation + "...");
            String result = FastestRoute.run(sourceStation, destinationStation, allStations);
            resultArea.setText(result);
        }
        if (e.getSource() == fewestChangesButton) {
            resultArea.setText("Searching for route from " + sourceStation + " to " + destinationStation + "...");
            String result = FewestChanges.run(sourceStation, destinationStation, allStations);
            resultArea.setText(result);
        }
    }
}