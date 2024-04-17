import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

interface FlatNode {
  id;
  name: string;
  level: number;
  disabled: boolean;
  expandable: boolean;
  highlighted: boolean;
}
interface TreeNode {
  id;
  name: string;
  disabled?: boolean;
  children?: TreeNode[];
  isExpanded?: boolean;
  isHighlighted?: boolean;
}

// const TREE_DATA: TreeNode[] = [];

@Component({
  selector: 'app-checkbox-tree',
  templateUrl: './checkbox-tree.component.html',
  styleUrls: ['./checkbox-tree.component.css'],
})
export class CheckboxTreeComponent implements OnInit, OnChanges {
  @Input() treeData: TreeNode[] = [];
  @Input() selectedNodes: FlatNode[] = [];
  @Output() selectedNodesChange: EventEmitter<FlatNode[]> = new EventEmitter<
    FlatNode[]
  >();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['treeData'] && changes['treeData'].currentValue) {
      this.dataSource.setData(changes['treeData'].currentValue);
    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.initializeSelectedNodes();
    }, 1000);
  }

  searchResults: FlatNode[] = [];

  searchQuery = '';

  private transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
            id: node?.id,
            name: node.name,
            level,
            expandable: !!node.children && node.children.length > 0,
            disabled: !!node.disabled,
            highlighted: false,
          };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  checklistSelection = new SelectionModel<FlatNode>(true);

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return (
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child))
    );
  }

  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    this.updateSelectedNodes();
  }

  itemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    this.updateSelectedNodes();
  }

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  updateSelectedNodes(): void {
    this.selectedNodes = [];
    const selectedNodesWithDuplicates = [];
    this.treeControl.dataNodes.forEach((node) => {
      if (this.checklistSelection.isSelected(node)) {
        if (!node.expandable) {
          // If the node itself is a leaf node, add it to the selectedNodes array
          selectedNodesWithDuplicates.push(node);
        } else {
          // If the node is expandable, find its leaf nodes and add them to the selectedNodes array
          const leafNodes = this.findLeafNodes(node);
          selectedNodesWithDuplicates.push(...leafNodes);
        }
      }
    });
    this.selectedNodes = Array.from(new Set(selectedNodesWithDuplicates));

    this.selectedNodesChange.emit(this.selectedNodes); // Emit the selected nodes
  }

  initializeSelectedNodes(): void {
    this.treeControl.dataNodes.forEach((node) => {
      const isPresent = this.selectedNodes.some(
        (selectedNode) => selectedNode.id === node.id
      );
      if (isPresent) {
        this.checklistSelection.select(node);
        this.checkAllParentsSelection(node);
        this.expandSelectedNodes(node);
      }
    });
  }

  expandSelectedNodes(node: FlatNode): void {
    this.treeControl.expand(node);
    let parent = this.getParentNode(node);
    while (parent) {
      this.treeControl.expand(parent);
      parent = this.getParentNode(parent);
    }
  }

  expandSelectedNodesParent(node: FlatNode): void {
    this.treeControl.collapseAll();
    let parent = this.getParentNode(node);
    while (parent) {
      this.treeControl.expand(parent);
      parent = this.getParentNode(parent);
    }
  }

  findLeafNodes(node: FlatNode): FlatNode[] {
    const leafNodes: FlatNode[] = [];
    const stack: FlatNode[] = [node];

    while (stack.length > 0) {
      const currentNode = stack.pop();
      if (!currentNode.expandable) {
        // If the current node is a leaf node, add it to the leafNodes array
        leafNodes.push(currentNode);
      } else {
        // If the current node is expandable, traverse its children
        const children = this.treeControl.getDescendants(currentNode);
        stack.push(...children);
      }
    }

    return leafNodes;
  }

  filterNodes(): void {
    const filterValue = this.searchQuery.toLowerCase().trim();
    const searchResultsNodes: FlatNode[] = [];
    if (filterValue != '' && filterValue.length >= 3) {
      this.treeControl.dataNodes.forEach((node) => {
        if (node.name.toLowerCase().includes(filterValue)) {
          searchResultsNodes.push(node);
        }
      });
    }
    this.searchResults = searchResultsNodes;
    this.treeControl.dataNodes.forEach((node) => (node.highlighted = false));
    this.searchResults.forEach((node) => {
      this.expandSelectedNodesParent(node);
      node.highlighted = true;
    });
  }

  private nodeMatchesSearch(node: TreeNode, query: string): boolean {
    // Check if the node name contains the search query
    if (node.name.toLowerCase().includes(query)) {
      return true;
    }

    // Recursively check if any child node matches the search query
    if (node.children) {
      for (const childNode of node.children) {
        if (this.nodeMatchesSearch(childNode, query)) {
          return true;
        }
      }
    }

    return false;
  }
}
